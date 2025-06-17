import React, { useState } from 'react';
import { createStaff } from '../../api/authApi';
import '../../styles/auth/register.css';

const CreateStaff = ({ onClose }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'STAFF',
    staffType: 'NORMAL_STAFF', // Default
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
    await createStaff({ ...form, role: 'STAFF', staffType: form.staffType });
    setSuccess('Tạo tài khoản nhân viên thành công!');
    setTimeout(() => {
      onClose();
    }, 2000);
  } catch (err) {
    if (err.response && err.response.data) {
      setError(err.response.data);
    } else {
      setError('Tạo tài khoản thất bại. Vui lòng thử lại.');
    }
  }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <form className="auth-form" onSubmit={handleRegister}>
          <h2>Tạo tài khoản nhân viên</h2>

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

          <select
            name="staffType"
            value={form.staffType}
            onChange={handleChange}
          >
            <option value="NORMAL_STAFF">Nhân viên thường</option>
            <option value="LAB_STAFF">Nhân viên xét nghiệm </option>
          </select>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <div className="popup-buttons">
            <button type="submit">Tạo tài khoản</button>
            <button type="button" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStaff;
