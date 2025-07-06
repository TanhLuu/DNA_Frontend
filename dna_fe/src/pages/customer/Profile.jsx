// src/pages/Profile.jsx
import React, { useState } from 'react';
import '../../styles/components/profile.css';
import { useCustomerProfile } from '../../hooks/Account/useProfile';
import { useAuth } from '../../hooks/Account/useAuth';

const genderOptions = ['Chọn giới tính', 'Nam', 'Nữ'];
const documentOptions = ['CCCD', 'Giấy khai sinh', 'Hộ chiếu'];

const Profile = () => {
  const {
    account, customer, isLoading, isSubmitting,
    setAccount, setCustomer, handleSave
  } = useCustomerProfile();

  const { resetPassword, success, error, setError, setSuccess } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewPass('');
    setConfirmPass('');
    setSuccess('');
    setError('');
  };

  const handlePasswordChange = async () => {
    if (newPass !== confirmPass) {
      setError('Mật khẩu không khớp.');
      return;
    }
    await resetPassword(newPass);
    if (!error) {
      setTimeout(closeModal, 1500);
    }
  };

  if (isLoading) return <div style={{ padding: '2rem' }}>Đang tải dữ liệu...</div>;

  return (
    <div className="profile-page">
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {account.fullName?.split(' ').map((w) => w[0]).join('').toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h2>{account.fullName || 'Thông tin cá nhân'}</h2>
            <p>{account.email || 'Email chưa cập nhật'}</p>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-field">
            <label>Họ tên</label>
            <input type="text" name="fullName" value={account.fullName} onChange={handleChange(setAccount)} />
          </div>
          <div className="profile-field">
            <label>Giới tính</label>
            <select name="gender" value={customer.gender} onChange={handleChange(setCustomer)}>
              {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="profile-field">
            <label>Ngày sinh</label>
            <input type="date" name="dateOfBirth" value={customer.dateOfBirth} onChange={handleChange(setCustomer)} />
          </div>
          <div className="profile-field">
            <label>Số điện thoại</label>
            <input type="text" name="phone" value={account.phone} onChange={handleChange(setAccount)} />
          </div>
          <div className="profile-field">
            <label>Email</label>
            <input type="email" name="email" value={account.email} onChange={handleChange(setAccount)} />
          </div>
          <div className="profile-field">
            <label>Địa chỉ</label>
            <input type="text" name="address" value={customer.address} onChange={handleChange(setCustomer)} />
          </div>
          <div className="profile-field">
            <label>Loại giấy tờ</label>
            <select name="documentType" value={customer.documentType} onChange={handleChange(setCustomer)}>
              {documentOptions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="profile-field">
            <label>Số giấy tờ</label>
            <input type="text" name="cccd" value={customer.cccd} onChange={handleChange(setCustomer)} />
          </div>
          <div className="profile-field">
            <label>Nơi cấp</label>
            <input type="text" name="placeOfIssue" value={customer.placeOfIssue} onChange={handleChange(setCustomer)} />
          </div>
          <div className="profile-field">
            <label>Ngày cấp</label>
            <input type="date" name="dateOfIssue" value={customer.dateOfIssue} onChange={handleChange(setCustomer)} />
          </div>
        </div>

        <div className="profile-actions">
          <button className="profile-btn profile-btn-dark" onClick={() => setModalOpen(true)}>Đổi mật khẩu</button>
          <button className="profile-btn profile-btn-accent" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu hồ sơ'}
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="profile-modal-overlay" onClick={closeModal}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <button className="profile-modal-close" onClick={closeModal}>×</button>
            <h3>Đổi mật khẩu</h3>
            <input type="password" placeholder="Mật khẩu mới" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
            <input type="password" placeholder="Xác nhận mật khẩu" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
            <button className="profile-btn profile-btn-accent" onClick={handlePasswordChange}>Cập nhật</button>
            {success && <p className="profile-success">{success}</p>}
            {error && <p className="profile-error">{error}</p>}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Profile;
