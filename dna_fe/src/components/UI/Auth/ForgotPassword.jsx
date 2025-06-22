// src/components/UI/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { forgotPassword } from '../../../api/authApi';
import '../../../styles/auth/AuthForm.css';

const ForgotPassword = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await forgotPassword(email);
      setMessage(res);
    } catch (err) {
      setError(err.response?.data || 'Something went wrong.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="auth-form-container">
          <h2 className="auth-form-title">Quên mật khẩu</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              placeholder="Nhập địa chỉ email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="auth-button" type="submit">Gửi liên kết đặt lại</button>
            {message && <p className="auth-message success">{message}</p>}
            {error && <p className="auth-message error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
