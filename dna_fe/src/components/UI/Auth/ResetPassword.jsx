import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import '../../../styles/auth/AuthForm.css';

const ResetPassword = ({ isOpen, onClose }) => {
  const { resetPassword, success, error } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirm) return alert('Mật khẩu không khớp');
    resetPassword(newPassword);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="auth-form-container">
          <h2 className="auth-form-title">Change Password</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button className="auth-button" type="submit">Update Password</button>
            {success && <p className="auth-message success">{success}</p>}
            {error && <p className="auth-message error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
