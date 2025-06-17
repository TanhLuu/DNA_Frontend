import React, { useEffect, useState } from 'react';
import {
  fetchAccountInfo,
  updateAccountInfo,
  getCustomerByAccountId,
  createCustomer,
  updateCustomer
} from '../api/accountApi';


const genderOptions = ['Nam', 'Nữ', 'Khác'];
const documentOptions = ['CCCD', 'Giấy khai sinh', 'Hộ chiếu'];

const formatDate = (iso) => iso?.split('T')[0] || '';

const Profile = () => {
  const [accountId, setAccountId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [account, setAccount] = useState({ fullName: '', phone: '', email: '' });
  const [customer, setCustomer] = useState({
    dateOfBirth: '', gender: '', address: '',
    documentType: '', dateOfIssue: '', placeOfIssue: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accRes = await fetchAccountInfo();
        const acc = accRes.data;
        setAccountId(acc.id);
        setAccount({ fullName: acc.fullName || '', phone: acc.phone || '', email: acc.email || '' });

        try {
          const cusRes = await getCustomerByAccountId(acc.id);
          const cus = cusRes.data;
          setCustomerId(cus.id);
          setCustomer({
            dateOfBirth: formatDate(cus.dateOfBirth),
            gender: cus.gender || 'Nam',
            address: cus.address || '',
            documentType: cus.documentType || 'CCCD',
            placeOfIssue: cus.placeOfIssue || '',
            dateOfIssue: formatDate(cus.dateOfIssue)
          });
        } catch (err) {
          if (err.response?.status !== 404) console.error('Fetch customer error:', err);
        }
      } catch (err) {
        console.error('Fetch account error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (setter) => (e) => setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

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
          setCustomerId(res.data.id);
        } catch (err) {
          if (err.response?.status === 500 &&
              err.response?.data?.message?.includes("Account ID existed before")) {
            const existing = await getCustomerByAccountId(accountId);
            const res = await updateCustomer(existing.data.id, customerData);
            setCustomerId(res.data.id);
          } else throw err;
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

  if (isLoading) return <div>Đang tải...</div>;


 return (
  <div className="profile-container">
    <h2>Thông tin cá nhân</h2>

    {/* Account Fields */}
    {['fullName', 'phone', 'email'].map((field) => (
      <div className="profile-field" key={field}>
        <label>{field === 'fullName' ? 'Họ tên' : field === 'phone' ? 'Số điện thoại' : 'Email'}:</label>
        <input
          type={field === 'email' ? 'email' : 'text'}
          name={field}
          value={account[field]}
          onChange={handleChange(setAccount)}
        />
      </div>
    ))}

    {/* Customer Fields */}
    <div className="profile-field">
      <label>Ngày sinh:</label>
      <input type="date" name="dateOfBirth" value={customer.dateOfBirth} onChange={handleChange(setCustomer)} />
    </div>
    <div className="profile-field">
      <label>Giới tính:</label>
      <select name="gender" value={customer.gender} onChange={handleChange(setCustomer)}>
        {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
      </select>
    </div>
    <div className="profile-field">
      <label>Địa chỉ:</label>
      <input type="text" name="address" value={customer.address} onChange={handleChange(setCustomer)} />
    </div>
    <div className="profile-field">
      <label>Loại giấy tờ:</label>
      <select name="documentType" value={customer.documentType} onChange={handleChange(setCustomer)}>
        {documentOptions.map(doc => <option key={doc} value={doc}>{doc}</option>)}
      </select>
    </div>
    <div className="profile-field">
      <label>Nơi cấp:</label>
      <input type="text" name="placeOfIssue" value={customer.placeOfIssue} onChange={handleChange(setCustomer)} />
    </div>
    <div className="profile-field">
      <label>Ngày cấp:</label>
      <input type="date" name="dateOfIssue" value={customer.dateOfIssue} onChange={handleChange(setCustomer)} />
    </div>

    <div className="profile-button">
      <button onClick={handleSave} disabled={isSubmitting}>
        {isSubmitting ? 'Đang lưu...' : 'Lưu thông tin'}
      </button>
    </div>
  </div>
);
}

export default Profile;
