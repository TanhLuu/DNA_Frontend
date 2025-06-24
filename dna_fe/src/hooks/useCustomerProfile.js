import { useEffect, useState } from 'react';
import {
  fetchAccountInfo,
  getCustomerByAccountId,
  createCustomer,
  updateCustomer
} from '../api/accountApi';

import { updateAccountInfo } from '../api/customerOrderApi';


const formatDate = (iso) => iso?.split('T')[0] || '';

export const useCustomerProfile = () => {
  const [accountId, setAccountId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [account, setAccount] = useState({ fullName: '', phone: '', email: '' });
  const [customer, setCustomer] = useState({
    dateOfBirth: '', gender: '', address: '',
    documentType: 'CCCD', cccd: '', dateOfIssue: '', placeOfIssue: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const acc = await fetchAccountInfo(); 
        setAccountId(acc.id);
        setAccount({
          fullName: acc.fullName || '',
          phone: acc.phone || '',
          email: acc.email || ''
        });

        try {
          const cus = await getCustomerByAccountId(acc.id); 
          setCustomerId(cus.id);
          localStorage.setItem('customerId', cus.id);

          setCustomer({
            dateOfBirth: formatDate(cus.dateOfBirth),
            gender: cus.gender || '',
            address: cus.address || '',
            documentType: cus.documentType || 'CCCD',
            cccd: cus.cccd || '',
            placeOfIssue: cus.placeOfIssue || '',
            dateOfIssue: formatDate(cus.dateOfIssue)
          });
        } catch (err) {
          if (err.response?.status !== 404) {
            console.error('Lỗi lấy thông tin customer:', err);
          }
        }
      } catch (err) {
        console.error('Lỗi lấy thông tin account:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!customer.address || !customer.placeOfIssue) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      setIsSubmitting(false);
      return;
    }

    try {
      await updateAccountInfo(accountId, account);
      const customerData = { ...customer, accountId };

      if (customerId) {
        await updateCustomer(customerId, customerData);
      } else {
        try {
          const res = await createCustomer(customerData); 
          setCustomerId(res.id);
          localStorage.setItem('customerId', res.id);
        } catch (err) {
          // Trường hợp account đã có customer
          if (
            err.response?.status === 500 &&
            err.response?.data?.message?.includes("Account ID existed before")
          ) {
            const existing = await getCustomerByAccountId(accountId);
            const res = await updateCustomer(existing.id, customerData);
            setCustomerId(res.id);
            localStorage.setItem('customerId', res.id);
          } else {
            throw err;
          }
        }
      }

      alert('Lưu thông tin thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu:', error);
      alert(`Lỗi: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    account,
    customer,
    isLoading,
    isSubmitting,
    setAccount,
    setCustomer,
    handleSave
  };
};
