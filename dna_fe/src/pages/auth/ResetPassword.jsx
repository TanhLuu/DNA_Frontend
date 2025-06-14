// src/pages/auth/ResetPassword.jsx
import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/auth/AuthForm.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axiosInstance.post('/auth/reset-password', {
        token,
        newPassword,
      });
      setMessage(res.data);
    } catch (err) {
      setError(err.response?.data || 'Error resetting password');
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Change Password</h2>
      <form onSubmit={handleReset} className="auth-form">
        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          className="auth-input"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          className="auth-input"
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button className="auth-button" type="submit">Update Password</button>
        {message && <p className="auth-message success">{message}</p>}
        {error && <p className="auth-message error">{error}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
