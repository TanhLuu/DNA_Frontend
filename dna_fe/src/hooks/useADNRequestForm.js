import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAccountInfo, getCustomerByAccountId } from '../api/accountApi';
import { useNavigate } from 'react-router-dom';

const useADNRequestForm = (getServices) => {
  console.log("useADNRequestForm initialized with:", getServices);
  
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    requesterName: '',
    gender: 'Nam',
    idCard: '',
    issueDate: '',
    issuePlace: '',
    address: '',
    phone: '',
    email: ''
  });

  const [sampleCount, setSampleCount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const formatDate = (iso) => iso?.split('T')[0] || '';

  // Thêm một bản sao riêng của hàm getServices
  const fetchServicesData = async () => {
    console.log("Calling getServices directly");
    try {
      const data = await getServices();
      console.log("Services data fetched:", data);
      return data;
    } catch (err) {
      console.error("Error in fetchServicesData:", err);
      // Fallback data để đảm bảo UI hoạt động
      return [{
        serviceID: 999,
        serviceName: "Dịch vụ xét nghiệm ADN",
        timeTest: 7,
        price: 10000000,
        serviceType: "Dân sự",
        describe: "Xét nghiệm ADN cơ bản"
      }];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Lấy thông tin tài khoản và dịch vụ đồng thời
        console.log("Starting data fetch...");
        
        // Hard-code tạm dữ liệu dịch vụ cho trường hợp API có vấn đề
        const hardcodedService = {
          serviceID: 1,
          serviceName: "Xét nghiệm ADN cơ bản",
          timeTest: 7,
          price: 10000000,
          serviceType: "Pháp lý",
          describe: "Dịch vụ xét nghiệm ADN cơ bản"
        };
        
        const accountPromise = fetchAccountInfo();
        let servicesData;
        
        try {
          console.log("Calling getServices function");
          servicesData = await getServices();
          console.log("Raw services data:", servicesData);
        } catch (servicesErr) {
          console.error("Error fetching services:", servicesErr);
          servicesData = [hardcodedService]; // Fallback
        }
        
        const acc = await accountPromise;
        const cus = await getCustomerByAccountId(acc.id);
        
        // Cập nhật thông tin khách hàng
        setCustomer({
          requesterName: acc.fullName || '',
          gender: cus.gender || 'Nam',
          idCard: cus.cccd || '',
          issueDate: formatDate(cus.dateOfIssue),
          issuePlace: cus.placeOfIssue || '',
          address: cus.address || '',
          phone: acc.phone || '',
          email: acc.email || ''
        });
        
        // Xử lý dữ liệu dịch vụ
        let finalServices = [];
        
        if (Array.isArray(servicesData) && servicesData.length > 0) {
          finalServices = servicesData;
        } 
        else if (servicesData && typeof servicesData === 'object') {
          finalServices = [servicesData];
        }
        else {
          finalServices = [hardcodedService]; // Fallback
        }
        
        // Chuẩn hóa trường dữ liệu
        const normalizedServices = finalServices.map(s => ({
          serviceID: s.serviceID ?? s.serviceId ?? s.service_id ?? 1,
          serviceName: s.serviceName ?? s.service_name ?? "Dịch vụ xét nghiệm ADN",
          serviceType: s.serviceType ?? s.service_type ?? "Pháp lý",
          timeTest: parseInt(s.timeTest ?? s.time_test ?? 7, 10),
          price: parseFloat(s.price ?? s.service_price ?? 10000000),
          describe: s.describe ?? s.description ?? ""
        }));
        
        console.log("Final normalized services:", normalizedServices);
        setServices(normalizedServices);
        
        // Chọn service đầu tiên
        if (normalizedServices.length > 0) {
          setSelectedService(normalizedServices[0]);
        }
        
      } catch (err) {
        console.error("Error in main fetchData:", err);
        setError("Không thể tải thông tin: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getServices]);

  const handleSampleChange = (e) => {
    const value = e.target.value;
    setSampleCount(value ? parseInt(value) : '');
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculateTotalPrice = (isCivil) => {
    if (!selectedService || !sampleCount || isNaN(sampleCount)) return null;
    const additionalCost = (sampleCount - 2) * (isCivil ? 1500000 : 2000000);
    return selectedService.price + (additionalCost > 0 ? additionalCost : 0);
  };

  const handleSubmit = async (e, isCivil) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) {
        throw new Error('Không tìm thấy ID khách hàng. Vui lòng đăng nhập.');
      }

      const orderData = {
        customerId: parseInt(customerId),
        staffId: null,
        serviceId: selectedService?.serviceID || parseInt(formData.testType),
        orderDate: formData.orderDate || new Date().toISOString().split('T')[0],
        orderStatus: 'PENDING',
        sampleMethod: formData.method || '',
        resultDeliveryMethod: formData.receiveAt || '',
        resultDeliverAddress: formData.resultAddress || '',
        sampleQuantity: parseInt(sampleCount) || 2,
        amount: calculateTotalPrice(isCivil) || 0
      };

      if (!orderData.serviceId || !orderData.resultDeliveryMethod || !orderData.sampleQuantity) {
        throw new Error('Vui lòng điền đầy đủ thông tin: Loại xét nghiệm, hình thức nhận kết quả, và số người cần phân tích.');
      }

      const res = await axios.post('http://localhost:8080/api/testorders', orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const orderId = res.data.orderId || res.data.id;
      const amount = orderData.amount;

      navigate('/payment', {
        state: {
          orderId,
          customerId,
          amount
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Tạo đơn hàng thất bại.');
      console.error('Submit error:', err);
    }
  };

  return {
    customer,
    sampleCount,
    isLoading,
    services,
    selectedService,
    setSelectedService,
    formData,
    error,
    success,
    handleSampleChange,
    handleInputChange,
    handleSubmit,
    calculateTotalPrice,
    formatDate,
    fetchServicesData // Thêm hàm này để component có thể gọi trực tiếp
  };
};

export default useADNRequestForm;