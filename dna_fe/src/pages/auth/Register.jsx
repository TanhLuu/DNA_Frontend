import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth/register.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    // Lấy danh sách user hiện có từ localStorage (nếu có)
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Kiểm tra email đã tồn tại
    const existingUser = users.find(user => user.email === form.email);
    if (existingUser) {
      setError('Email đã được sử dụng. Vui lòng chọn email khác.');
      return;
    }

    // Thêm user mới vào danh sách
    const newUsers = [...users, form];
    localStorage.setItem('users', JSON.stringify(newUsers));

    // Đăng ký xong thì chuyển hướng sang trang đăng nhập
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Đăng ký</h2>

        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          required
          value={form.name}
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
          type="password"
          name="password"
          placeholder="Mật khẩu"
          required
          value={form.password}
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
