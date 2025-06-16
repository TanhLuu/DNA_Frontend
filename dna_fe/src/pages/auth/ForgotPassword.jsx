import React, { useState } from 'react';
import { forgotPassword } from '../../api/authApi';
import '../../styles/auth/AuthForm.css';

const ForgotPassword = () => {
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

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="auth-input"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="auth-button" type="submit">Send Reset Link</button>
        {message && <p className="auth-message success">{message}</p>}
        {error && <p className="auth-message error">{error}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
