// src/components/UI/Auth/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import '../../../styles/auth/register.css';

const Register = ({ isOpen, onClose, onSwitch }) => {
  const { register, error, success } = useAuth();
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Đăng ký</h2>
          <input type="text" name="username" placeholder="Tài khoản" required value={form.username} onChange={handleChange} />
          <input type="password" name="password" placeholder="Mật khẩu" required value={form.password} onChange={handleChange} />
          <input type="text" name="fullName" placeholder="Họ tên" required value={form.fullName} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required value={form.email} onChange={handleChange} />
          <input type="text" name="phone" placeholder="Số điện thoại" required value={form.phone} onChange={handleChange} />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit">Đăng ký</button>
          <div className="auth-links">
            <p>
              Đã có tài khoản?{' '}
              <a href="/login" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
                Đăng nhập
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
