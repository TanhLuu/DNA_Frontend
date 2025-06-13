import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authApi';
import '../../styles/auth/register.css';
import { loginUser } from '../../api/authApi';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  try {
    // Đăng ký tài khoản
    await registerUser(form);

    // Đăng nhập ngay
    const loginData = await loginUser(form.username, form.password);

    const role = loginData.role?.toUpperCase();
    localStorage.setItem('username', loginData.username);
    localStorage.setItem('role', role);
    localStorage.setItem('fullName', loginData.fullName || '');
    localStorage.setItem('email', loginData.email || '');
    localStorage.setItem('phone', loginData.phone || '');
    localStorage.setItem('accountId', loginData.accountId); // Lưu ID để tạo customer
    window.dispatchEvent(new Event('storage'));

    // Chuyển đến trang cập nhật hồ sơ
    navigate('/profile');
  } catch (err) {
    if (err.response?.data) {
      setError(err.response.data);
    } else {
      setError('Đăng ký hoặc đăng nhập thất bại. Vui lòng thử lại.');
    }
  }
};


  return (
    <div className="auth-container">
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
        <button type="submit">Đăng ký</button>
        <p>
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </form>
    </div>
  );
};

export default Register;