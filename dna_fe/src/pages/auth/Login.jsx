import React, { useState } from 'react';
import { login } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      alert(res.data.message);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Đăng nhập</h2>
      <input name="username" onChange={handleChange} placeholder="Tên đăng nhập" required />
      <input name="password" type="password" onChange={handleChange} placeholder="Mật khẩu" required />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Đăng nhập</button>
    </form>
  );
};

export default Login;
