import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth/login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Giả lập người dùng
    const mockUsers = [
      {
        username: 'customer1',
        password: '123456',
        role: 'customer',
        fullName: 'Nguyễn Văn A',
        email: 'customer1@example.com',
        phone: '0123456789'
      },
      {
        username: 'staff1',
        password: '123456',
        role: 'staff',
        fullName: 'Trần Thị B',
        email: 'staff1@example.com',
        phone: '0987654321'
      }
    ];

    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem('username', user.username);
      localStorage.setItem('role', user.role);
      localStorage.setItem('fullName', user.fullName);
      localStorage.setItem('email', user.email);
      localStorage.setItem('phone', user.phone);
      window.dispatchEvent(new Event('storage'));

      if (user.role === 'staff') {
        navigate('/'); // hoặc sau này navigate('/staff/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError('Tài khoản hoặc mật khẩu không đúng.');
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

        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mật khẩu"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className="error">{error}</p>}
        <button type="submit">Đăng nhập</button>
        <p>
          Chưa có tài khoản? <a href="/register">Đăng ký</a>
        </p>
      </form>
    </div>
  );
};

export default Login;