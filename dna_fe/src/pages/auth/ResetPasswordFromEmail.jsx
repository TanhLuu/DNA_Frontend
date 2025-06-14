// src/pages/auth/ResetPasswordFromEmail.jsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../../styles/auth/AuthForm.css';

const ResetPasswordFromEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data);
      }

      setMessage(data);
      setError('');
    } catch (err) {
      setError(err.message);
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
