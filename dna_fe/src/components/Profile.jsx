import React from 'react';
import '../styles/components/profile.css';
import { useCustomerProfile } from '../hooks/useCustomerProfile';

const genderOptions = ['Nam', 'Nữ', 'Khác'];
const documentOptions = ['CCCD', 'Giấy khai sinh', 'Hộ chiếu'];

const Profile = () => {
  const {
    account, customer, isLoading, isSubmitting,
    setAccount, setCustomer, handleSave
  } = useCustomerProfile();

  const handleChange = (setter) => (e) =>
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  if (isLoading) return <div>Đang tải...</div>;

  return (
    <div className="profile-container">
      <h2>Thông tin cá nhân</h2>

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

      <div className="profile-field">
        <label>Ngày sinh:</label>
        <input type="date" name="dateOfBirth" value={customer.dateOfBirth} onChange={handleChange(setCustomer)} />
      </div>
      <div className="profile-field">
        <label>Giới tính:</label>
        <select name="gender" value={customer.gender} onChange={handleChange(setCustomer)}>
          {genderOptions.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="profile-field">
        <label>Địa chỉ:</label>
        <input type="text" name="address" value={customer.address} onChange={handleChange(setCustomer)} />
      </div>
      <div className="profile-field">
        <label>Loại giấy tờ:</label>
        <select name="documentType" value={customer.documentType} onChange={handleChange(setCustomer)}>
          {documentOptions.map((doc) => (
            <option key={doc} value={doc}>{doc}</option>
          ))}
        </select>
      </div>
      <div className="profile-field">
        <label>Số giấy tờ:</label>
        <input type="text" name="cccd" value={customer.cccd} onChange={handleChange(setCustomer)} />
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
};

export default Profile;
