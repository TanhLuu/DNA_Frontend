import { useEffect, useState } from 'react';
import { fetchAccountInfo, getCustomerByAccountId } from './accountApi';
import { getAllLegalServices, getAllCivilServices } from './serviceApi';

const useADNForm = (isLegal) => {
  const [customer, setCustomer] = useState({
    requesterName: '',
    gender: 'Nam',
    idCard: '',
    issueDate: '',
    issuePlace: '',
    address: '',
    phone: '',
    email: '',
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
          email: acc.email || '',
        });

        const services = isLegal ? await getAllLegalServices() : await getAllCivilServices();
        setServices(services);
      } catch (err) {
        console.error('Error fetching info:', err);
        setError('Không thể tải dữ liệu khách hàng hoặc dịch vụ.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isLegal]);

  const handleSampleChange = (e) => {
    const value = e.target.value;
    setSampleCount(value ? parseInt(value) : '');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotalPrice = () => {
    if (!selectedService || !sampleCount || isNaN(sampleCount)) return null;
    const additionalCost = (sampleCount - 2) * (isLegal ? 2000000 : 1500000);
    return selectedService.price + (additionalCost > 0 ? additionalCost : 0);
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
    setError,
    success,
    setSuccess,
    handleSampleChange,
    handleInputChange,
    calculateTotalPrice,
    setFormData,
    setSampleCount,
  };
};

export default useADNForm;