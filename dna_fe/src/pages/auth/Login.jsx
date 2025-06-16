import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/authApi';
import { getCustomerByAccountId } from '../../api/accountApi';
import '../../styles/auth/login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
      const response = await loginUser(username, password);
      const { account, token } = response.data;

      if (!token) {
        throw new Error('Không nhận được token từ server');
      }

      // Lưu thông tin vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('accountId', account.id);
      localStorage.setItem('username', account.username);
      localStorage.setItem('role', account.role?.toUpperCase() || '');
      localStorage.setItem('fullName', account.fullName || '');
      localStorage.setItem('email', account.email || '');
      localStorage.setItem('phone', account.phone || '');

      // Cập nhật trạng thái App.jsx (nếu có)
      window.dispatchEvent(new Event('storage'));

      // Điều hướng theo vai trò
      const role = account.role?.toUpperCase() || '';

      if (role === 'STAFF' || role === 'ADMIN') {
        navigate('/ordersPageAdmin', { replace: true });
      } else if (role === 'CUSTOMER') {
        try {
          const customerRes = await getCustomerByAccountId(account.id);
          const customer = customerRes?.data;

          if (customer?.id) {
            navigate('/', { replace: true }); // Hồ sơ tồn tại
          } else {
            navigate('/profile', { replace: true }); // Không có hồ sơ
          }
        } catch (error) {
          // Dù lỗi gì cũng buộc chuyển đến /profile
          console.error('Lỗi khi kiểm tra hồ sơ customer:', error);
          navigate('/profile', { replace: true });
        }
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Đăng nhập thất bại. Vui lòng thử lại.'
      );
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
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit">Đăng nhập</button>

        <div className="auth-links">
          <p>
            Chưa có tài khoản? <a href="/register">Đăng ký</a>
          </p>
          <p>
            <a href="/forgot-password">Quên mật khẩu?</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
