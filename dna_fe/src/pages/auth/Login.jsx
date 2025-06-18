import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/auth/login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const { login, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>
        <input type="text" placeholder="Tài khoản" required value={username} onChange={(e) => setUsername(e.target.value)} />
        <div className="password-field">
          <input type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Đăng nhập</button>
        <div className="auth-links">
          <p>Chưa có tài khoản? <a href="/register">Đăng ký</a></p>
          <p><a href="/forgot-password">Quên mật khẩu?</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
