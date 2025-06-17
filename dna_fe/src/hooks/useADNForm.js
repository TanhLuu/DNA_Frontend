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
        const accRes = await fetchAccountInfo();
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

        const servicesData = await getServices();
        setServices(servicesData);
      } catch (err) {
        console.error('Error fetching info:', err);
        setError('Failed to load customer or service data.');
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        setError('Customer ID not found in localStorage. Please log in.');
        return;
      }

      const orderData = {
        customerId: parseInt(customerId),
        staffId: null,
        serviceId: parseInt(formData.testType),
        orderDate: formData.orderDate || new Date().toISOString().split('T')[0],
        orderStatus: formData.orderStatus || 'PENDING',
        sampleType: formData.method || '',
        resultDeliveryMethod: formData.receiveAt || '',
        resultDeliverAddress: formData.resultAddress || '',
        kitCode: formData.method === 'home' ? `KIT-${Math.random().toString(36).substr(2, 9)}` : null,
        sampleQuantity: parseInt(sampleCount) || 2,
        amount: calculateTotalPrice(isCivil) || 0,
      };

      const orderResponse = await axios.post('http://localhost:8080/api/testorders', orderData, {
        headers: { 'Content-Type': 'application/json' },
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
          await axios.post('http://localhost:8080/api/testSamples', sample, {
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (sampleErr) {
          failedSamples.push(`Sample ${index + 1}: ${sampleErr.response?.data?.message || sampleErr.message}`);
        }
      }

      if (failedSamples.length > 0) {
        setError(`Some samples failed to save: ${failedSamples.join('; ')}`);
      } else {
        setSuccess('Bạn đã tạo đơn thành công');
        setFormData({});
        setSampleCount("");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create Test Order or Samples.');
      console.error('Error:', err);
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