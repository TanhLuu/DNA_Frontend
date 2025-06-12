import React, { useState, useEffect } from 'react';
import '../../styles/components/profile.css';


const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    // Giả lập fetch dữ liệu từ DB
    async function fetchData() {
      const res = {
        name: 'Nguyễn Văn An',
        phone: '0945123456',
        email: 'nguyenvan.an@example.com',
        address: '123 Đường Lê Lợi, Quận 1, TP. HCM',
      };
      setFormData(res);
    }

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    // Bạn có thể reset về giá trị DB gốc nếu cần
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit data:', formData);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <h3 className="profile-name">{formData.name}</h3>
            <p className="profile-sub">Số điện thoại: {formData.phone}</p>
            <p className="profile-sub">Email: {formData.email}</p>
          </div>
        </div>

        <h4 className="profile-section-title">Thông tin cá nhân</h4>
        <div className="profile-info-grid">
          <div className="label">Ngày sinh:</div>
          <div>15/03/1980</div>
          <div className="label">Giới tính:</div>
          <div>Nam</div>
          <div className="label">Số điện thoại:</div>
          <div>0123456789</div>
          <div className="label">Email:</div>
          <div>abc@mail.com</div>
        </div>

        <h4 className="profile-section-title">Chỉnh sửa thông tin</h4>
        <form onSubmit={handleSubmit} className="profile-form">
          <div>
            <label>Họ tên</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label>Số điện thoại</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <label>Địa chỉ email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label>Địa chỉ</label>
            <input name="address" value={formData.address} onChange={handleChange}></input>
          </div>
          <div className="profile-actions">
            <button type="submit" className="btn-save">Lưu thay đổi</button>
            <button type="button" onClick={handleReset} className="btn-reset">Đặt lại</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
