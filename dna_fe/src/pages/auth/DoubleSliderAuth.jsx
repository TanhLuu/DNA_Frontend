import React, { useState, useEffect } from 'react';
import '../../styles/auth/DoubleSliderAuth.css';
import { useAuth } from '../../hooks/Account/useAuth';

const DoubleSliderAuth = () => {
  const [mode, setMode] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'CUSTOMER'
  });
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');

  const { login, register, resetPasswordWithEmailToken, error, success, setError, setSuccess } = useAuth();

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token');
    if (urlToken) {
      localStorage.setItem('resetToken', urlToken);
      setToken(urlToken);
      setMode('reset');
      window.history.replaceState({}, document.title, '/reset-password');
    }
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login(loginData.username, loginData.password);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    await register(registerData);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const res = await require('../../api/authApi').forgotPassword(email);
      setSuccess(res);
    } catch (err) {
      setError(err.response?.data || 'Gửi email thất bại.');
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return alert('Mật khẩu không khớp');
    resetPasswordWithEmailToken(token || localStorage.getItem('resetToken'), newPassword);
  };

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <h3 className="auth-title">Đăng nhập</h3>
            <input className="auth-input" type="text" placeholder="Tài khoản" required value={loginData.username} onChange={e => setLoginData({ ...loginData, username: e.target.value })} />
            <input className="auth-input" type="password" placeholder="Mật khẩu" required value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-btn" type="submit">Đăng nhập</button>
            <p><a href="#" onClick={e => { e.preventDefault(); setMode('forgot'); setError(''); }}>Quên mật khẩu?</a></p>
          </form>
        );
      case 'register':
        return (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <h3 className="auth-title">Đăng ký</h3>
            <input className="auth-input" type="text" placeholder="Tài khoản" required value={registerData.username} onChange={e => setRegisterData({ ...registerData, username: e.target.value })} />
            <input className="auth-input" type="password" placeholder="Mật khẩu" required value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} />
            <input className="auth-input" type="text" placeholder="Họ tên" required value={registerData.fullName} onChange={e => setRegisterData({ ...registerData, fullName: e.target.value })} />
            <input className="auth-input" type="email" placeholder="Email" required value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />
            <input className="auth-input" type="text" placeholder="Số điện thoại" required value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} />
            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}
            <button className="auth-btn" type="submit">Đăng ký</button>
          </form>
        );
      case 'forgot':
        return (
          <form className="auth-form" onSubmit={handleForgotSubmit}>
            <h3 className="auth-title">Quên mật khẩu</h3>
            <input className="auth-input" type="email" placeholder="Nhập địa chỉ email" value={email} onChange={e => setEmail(e.target.value)} required />
            <button className="auth-btn" type="submit">Gửi liên kết đặt lại</button>
            {success && <p className="auth-success">{success}</p>}
            {error && <p className="auth-error">{error}</p>}
            <p><a href="#" onClick={e => { e.preventDefault(); setMode('login'); }}>Quay lại đăng nhập</a></p>
          </form>
        );
      case 'reset':
        return (
          <form className="auth-form" onSubmit={handleResetSubmit}>
            <h3 className="auth-title">Đặt lại mật khẩu</h3>
            <input className="auth-input" type="password" placeholder="Mật khẩu mới" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <input className="auth-input" type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            <button className="auth-btn" type="submit">Cập nhật</button>
            {success && <p className="auth-success">{success}</p>}
            {error && <p className="auth-error">{error}</p>}
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-all">
      <div className={`container-auth ${mode === 'register' ? 'active' : ''}`} id="container">
        <div className={`form-container ${mode === 'register' ? 'sign-up-container' : 'sign-in-container'}`}>
          {renderForm()}
        </div>
        <div className="overlay-container">
          <div>
            <h3>{mode === 'register' ? 'Chào mừng quay lại!' : 'Xin chào bạn mới!'}</h3>
            <p>{mode === 'register' ? 'Để tiếp tục, vui lòng đăng nhập.' : 'Hãy nhập thông tin để bắt đầu hành trình.'}</p>
            <button className="auth-switch-btn" onClick={() => setMode(mode === 'register' ? 'login' : 'register')}>
              {mode === 'register' ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubleSliderAuth;
