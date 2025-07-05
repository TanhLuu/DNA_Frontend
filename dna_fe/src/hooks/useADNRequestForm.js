import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAccountInfo, getCustomerByAccountId } from '../api/accountApi';
import { useNavigate } from 'react-router-dom';

const useADNRequestForm = (getServices, isCivil) => {
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

  const [sampleCount, setSampleCount] = useState(2); // Mặc định là 2
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({ method: isCivil ? '' : 'center' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null); // Thêm state để lưu giá tổng

  const formatDate = (iso) => iso?.split('T')[0] || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [acc, servicesData] = await Promise.all([
          fetchAccountInfo(),
          getServices()
        ]);

        const cus = await getCustomerByAccountId(acc.id);

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

        setServices(servicesData || []);

        if (Array.isArray(servicesData) && servicesData.length > 0) {
          setSelectedService(servicesData[0]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải thông tin khách hàng hoặc dịch vụ.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getServices]);

  useEffect(() => {
    // Đảm bảo method là "center" khi không phải isCivil
    if (!isCivil && formData.method !== 'center') {
      setFormData((prev) => ({ ...prev, method: 'center' }));
    }
  }, [isCivil]);

  useEffect(() => {
    // Gọi API để tính giá tổng khi selectedService hoặc sampleCount thay đổi
    const fetchTotalPrice = async () => {
      if (selectedService && sampleCount) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/services/${selectedService.serviceID}/calculate-price?numberOfSamples=${sampleCount}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          setTotalPrice(response.data);
        } catch (err) {
          console.error('Error calculating total price:', err);
          setTotalPrice(null);
          setError('Không thể tính giá tổng.');
        }
      } else {
        setTotalPrice(null);
      }
    };

    fetchTotalPrice();
  }, [selectedService, sampleCount]);

  const handleSampleChange = (e) => {
    const value = e.target.value;
    setSampleCount(value ? parseInt(value) : 2); // Mặc định là 2 nếu không chọn
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculateTotalPrice = () => {
    return totalPrice; // Trả về giá tổng từ state
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

      const amount = totalPrice || 0; // Sử dụng totalPrice từ state

      const formDataObj = new FormData(e.target);
      const formDataEntries = Object.fromEntries(formDataObj);

      const orderData = {
        customerId: parseInt(customerId),
        staffId: null,
        serviceId: selectedService?.serviceID || parseInt(formData.testType),
        orderDate: formData.orderDate || new Date().toISOString().split('T')[0],
        orderStatus: 'PENDING',
        sampleMethod: isCivil ? formData.method || formDataEntries.method || '' : 'center',
        resultDeliveryMethod: formData.receiveAt || formDataEntries.receiveAt || '',
        resultDeliverAddress: formData.resultAddress || formDataEntries.resultAddress || '',
        sampleQuantity: parseInt(sampleCount) || 2,
        amount: amount
      };

      if (!orderData.serviceId || !orderData.resultDeliveryMethod || !orderData.sampleQuantity) {
        throw new Error('Vui lòng điền đầy đủ thông tin: Loại xét nghiệm, hình thức nhận kết quả, và số người cần phân tích.');
      }

      console.log('orderData:', orderData);

      const res = await axios.post('http://localhost:8080/api/testorders', orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const orderId = res.data.orderId || res.data.id;

      setSuccess('Tạo đơn hàng thành công!');
      setFormData({ method: isCivil ? '' : 'center' });
      setSampleCount(2); // Reset về mặc định

      navigate('/payment', {
        state: {
          orderId,
          customerId,
          customerName: customer.requesterName,
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
    setFormData,
    error,
    success,
    handleSampleChange,
    handleInputChange,
    handleSubmit,
    calculateTotalPrice,
    formatDate
  };
};

export default useADNRequestForm;