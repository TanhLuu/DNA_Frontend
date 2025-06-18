import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAccountInfo, getCustomerByAccountId } from '../api/accountApi';

const useADNRequestForm = (getServices) => {
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

  const [sampleCount, setSampleCount] = useState("");
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
        const [accRes, servicesData] = await Promise.all([
          fetchAccountInfo(),
          getServices()
        ]);
        const acc = accRes.data;
        const cusRes = await getCustomerByAccountId(acc.id);
        const cus = cusRes.data;

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

        setServices(servicesData.data || servicesData);
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
    setSampleCount(value ? parseInt(value) : "");
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
        serviceId: parseInt(formData.testType),
        orderDate: formData.orderDate || new Date().toISOString().split('T')[0],
        orderStatus: 'PENDING',
        sampleType: formData.method || '',
        resultDeliveryMethod: formData.receiveAt || '',
        resultDeliverAddress: formData.resultAddress || '',
        kitCode: formData.method === 'home' ? `KIT-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null,
        sampleQuantity: parseInt(sampleCount) || 2,
        amount: calculateTotalPrice(isCivil) || 0,
      };

      // Validate required fields
      if (!orderData.serviceId || !orderData.sampleType || !orderData.resultDeliveryMethod) {
        throw new Error('Vui lòng điền đầy đủ thông tin: Loại xét nghiệm, phương thức lấy mẫu, và hình thức nhận kết quả.');
      }

      const orderResponse = await axios.post('http://localhost:8080/api/testorders', orderData, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const orderId = orderResponse.data.orderId;

      const samples = [];
      for (let i = 1; i <= sampleCount; i++) {
        const index = i;
        const sampleData = {
          orderId,
          customerId: parseInt(customerId),
          staffId: null,
          name: formData[`person${index}Name`] || '',
          gender: formData[`person${index}Gender`] || '',
          dateOfBirth: formData[`person${index}Dob`] || '',
          relationship: formData[`person${index}Relationship`] || '',
          sampleType: formData[`person${index}SampleType`] || '',
          numberOfSample: parseInt(formData[`person${index}SampleAmount`]) || 1,
          medicalHistory: formData[`person${index}BloodHistory`] || '',
          fingerprint: '',
          ...(isCivil ? {} : {
            documentType: formData[`person${index}DocumentType`] || '',
            documentNumber: formData[`person${index}DocumentNumber`] || '',
            dateOfIssue: formData[`person${index}IssueDate`] || '',
            expirationDate: formData[`person${index}ExpiryDate`] || '',
            placeOfIssue: formData[`person${index}IssuePlace`] || '',
            nationality: formData[`person${index}Nationality`] || '',
            address: formData[`person${index}Address`] || '',
          }),
        };
        samples.push(sampleData);
      }

      const failedSamples = [];
      for (const [index, sample] of samples.entries()) {
        try {
          if (!sample.name || !sample.sampleType) {
            throw new Error(`Mẫu ${index + 1}: Thiếu tên hoặc loại mẫu.`);
          }
          await axios.post('http://localhost:8080/api/testSamples', sample, {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
          });
        } catch (sampleErr) {
          failedSamples.push(`Mẫu ${index + 1}: ${sampleErr.response?.data?.message || sampleErr.message}`);
        }
      }

      if (failedSamples.length > 0) {
        setError(`Một số mẫu không được lưu: ${failedSamples.join('; ')}`);
      } else {
        setSuccess('Tạo đơn hàng thành công!');
        setFormData({});
        setSampleCount("");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Tạo đơn hàng hoặc mẫu thất bại.');
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
  };
};

export default useADNRequestForm;