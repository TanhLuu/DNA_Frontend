import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth/register.css';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const existingUser = users.find(user => user.username === form.username || user.email === form.email);
    if (existingUser) {
      setError('Email đã được sử dụng. Vui lòng chọn email khác.');
      return;
    }

    const newUsers = [...users, form];
    localStorage.setItem('users', JSON.stringify(newUsers));

    navigate('/login');
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

        <button type="submit">Đăng ký</button>
        <p>Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
      </form>
    </div>
  );
};

export default Register;
