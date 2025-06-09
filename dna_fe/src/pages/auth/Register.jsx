import React, { useState } from 'react';
import { register } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    username: '', password: '', fullName: '', email: '', phone: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng ký thất bại');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Đăng ký</h2>
      <input name="username" onChange={handleChange} placeholder="Tên đăng nhập" required />
      <input name="password" onChange={handleChange} placeholder="Mật khẩu" required />
      <input name="fullName" onChange={handleChange} placeholder="Họ tên" required />
      <input name="email" onChange={handleChange} placeholder="Email" required />
      <input name="phone" onChange={handleChange} placeholder="SĐT" required />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Đăng ký</button>
    </form>
  );
};

export default Register;
