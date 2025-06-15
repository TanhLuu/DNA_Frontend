import React, { useState, useEffect } from 'react';
import { resetPasswordWithToken } from '../../api/authApi';
import '../../styles/auth/AuthForm.css';

const ResetPasswordFromEmail = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('resetToken', tokenFromUrl);
      setToken(tokenFromUrl);
      window.history.replaceState({}, document.title, '/reset-password');
    } else {
      const savedToken = localStorage.getItem('resetToken');
      if (savedToken) setToken(savedToken);
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await resetPasswordWithToken(token, newPassword);
      setMessage(res);
      setError('');
      localStorage.removeItem('resetToken');
    } catch (err) {
      setError(err.response?.data || err.message || 'Something went wrong.');
      setMessage('');
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Reset Your Password</h2>
      <form className="auth-form" onSubmit={handleReset}>
        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          className="auth-input"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Reset Password</button>
      </form>
      {message && <p className="auth-message success">{message}</p>}
      {error && <p className="auth-message error">{error}</p>}
    </div>
  );
};

export default ResetPasswordFromEmail;
