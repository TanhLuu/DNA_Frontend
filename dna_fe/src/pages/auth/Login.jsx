import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/authApi';
import '../../styles/auth/login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getCustomerByAccountId } from '../../api/customerApi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const data = await loginUser(username, password);

    const role = data.role?.toUpperCase();
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', role);
    localStorage.setItem('fullName', data.fullName || '');
    localStorage.setItem('email', data.email || '');
    localStorage.setItem('phone', data.phone || '');
    localStorage.setItem('accountId', data.accountId);
    window.dispatchEvent(new Event('storage'));

    if (role === 'STAFF' || role === 'ADMIN') {
      navigate('/ordersPageAdmin');
    } else if (role === 'CUSTOMER') {
      try {
        const customer = await getCustomerByAccountId(data.accountId);

        if (customer && customer.id) {
          // Đã có hồ sơ
          navigate('/');
        } else {
          // Chưa có hồ sơ
          navigate('/profile');
        }
      } catch (e) {
        // Lỗi gọi API hoặc chưa có hồ sơ
        navigate('/profile');
      }
    }
  } catch (err) {
    if (err.response && err.response.data) {
      setError(err.response.data);
    } else {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    }
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

