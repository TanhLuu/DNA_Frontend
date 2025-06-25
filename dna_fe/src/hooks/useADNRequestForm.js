import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAccountInfo, getCustomerByAccountId } from '../api/accountApi';
import { useNavigate } from 'react-router-dom';

const useADNRequestForm = (getServices) => {
  const navigate = useNavigate(); // ✅ Gọi đúng chỗ

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

        // ✅ Tự động chọn dịch vụ đầu tiên nếu có
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

      const amount = calculateTotalPrice(isCivil) || 0;

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
        amount: amount
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

      setSuccess('Tạo đơn hàng thành công!');
      setFormData({});
      setSampleCount('');

      // ✅ Chuyển trang sau khi thành công
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
    formatDate
  };
};

export default useADNRequestForm;
