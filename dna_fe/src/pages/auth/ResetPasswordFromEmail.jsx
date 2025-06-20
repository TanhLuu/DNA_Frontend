import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/auth/ResetPasswordFromEmail.css';

const ResetPasswordFromEmail = () => {
  const { resetPasswordWithEmailToken, success, error } = useAuth();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token');
    if (urlToken) {
      localStorage.setItem('resetToken', urlToken);
      setToken(urlToken);
      window.history.replaceState({}, document.title, '/reset-password');
    } else {
      const savedToken = localStorage.getItem('resetToken');
      if (savedToken) setToken(savedToken);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPasswordWithEmailToken(token, newPassword);
  };

  return (
    <div className="reset-password-wrapper">
      <div className="reset-password-container">
        <h2 className="reset-password-title">Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="reset-password-form">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
          {success && <p className="auth-message success">{success}</p>}
          {error && <p className="auth-message error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordFromEmail;
