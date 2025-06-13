import React, { useState } from 'react';
import '../styles/components/Profile.css';

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: 'Nguyễn Văn An',
    phone: '0945123456',
    email: 'nguyenvanan@example.com',
    address: '123 Đường Lê Lợi, Quận 1, TP. HCM',
    birthDate: '15/03/1980',
    gender: 'Nam'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            <span className="avatar-text">
              {formData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </span>
          </div>
          <div className="user-info">
            <h2>{formData.fullName}</h2>
            <p>{formData.email}</p>
          </div>
        </div>

        <div className="profile-content">
          <h3>Thông tin cá nhân</h3>
          <div className="info-section">
            <div className="info-row">
              <label>Ngày sinh:</label>
              <span>{formData.birthDate}</span>
            </div>
            <div className="info-row">
              <label>Giới tính:</label>
              <span>{formData.gender}</span>
            </div>
            <div className="info-row">
              <label>Số điện thoại:</label>
              <span>{formData.phone}</span>
            </div>
            <div className="info-row">
              <label>Email:</label>
              <span>{formData.email}</span>
            </div>
            <div className="info-row">
              <label>Địa chỉ:</label>
              <span>{formData.address}</span>
            </div>
          </div>

          <h3>Chỉnh sửa thông tin</h3>
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label>Họ tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div className="button-group">
              {!isEditing ? (
                <button type="button" onClick={() => setIsEditing(true)} className="edit-btn">
                  Chỉnh sửa
                </button>
              ) : (
                <>
                  <button type="submit" className="save-btn">Lưu thay đổi</button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    className="cancel-btn"
                  >
                    Đặt lại
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;