import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import '../../styles/auth/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError('');

  //   try {
  //     const response = await axios.post('http://localhost:8080/auth/login', {
  //       username,
  //       password,
  //     });

  //     const data = response.data;

  //     // Lưu thông tin người dùng (nếu có token thì lưu token)
  //     localStorage.setItem('token', data.token || '');
  //     localStorage.setItem('username', data.username);
  //     localStorage.setItem('role', data.role || 'customer');

  //     data.role === 'admin'
  //       ? navigate('/admin/dashboard')
  //       :  navigate('/customer/home');
  //   } catch (err) {
  //     if (err.response && err.response.data && err.response.data.message) {
  //       setError(err.response.data.message);
  //     } else {
  //       setError('Đăng nhập thất bại. Vui lòng thử lại.');
  //     }
  //   }
  // };

const handleLogin = (e) => {
  e.preventDefault();
  setError('');

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const foundUser = users.find(user => user.email === username && user.password === password);

  if (foundUser) {
    localStorage.setItem('username', foundUser.name);
    localStorage.setItem('role', 'customer'); // hoặc 'admin' nếu muốn
    navigate('/');
  } else {
    setError('Email hoặc mật khẩu không đúng.');
  }
};



  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Đăng nhập</h2>

        <input
          type="text"
          placeholder="Tài khoản"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Đăng nhập</button>
        <p>Chưa có tài khoản? <a href="/register">Đăng ký</a></p>
      </form>
    </div>
  );
};

export default Login;