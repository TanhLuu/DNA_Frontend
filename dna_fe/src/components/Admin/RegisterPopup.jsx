// src/components/admin/RegisterPopup.jsx
import React, { useState } from 'react';
import { registerUser } from '../../api/authApi';
import '../../styles/auth/register.css';

const RegisterPopup = ({ onClose }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'STAFF',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await registerUser({ ...form, role: 'STAFF' });
      setSuccess('Đăng ký thành công!');
      setTimeout(() => {
        onClose(); // đóng popup sau khi đăng ký thành công
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <form className="auth-form" onSubmit={handleRegister}>
          <h2>Đăng ký</h2>

          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            required
            value={form.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            required
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="text"
            name="fullName"
            placeholder="Họ và tên"
            required
            value={form.fullName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            required
            value={form.phone}
            onChange={handleChange}
          />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <div className="popup-buttons">
            <button type="submit">Đăng ký</button>
            <button type="button" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPopup;
