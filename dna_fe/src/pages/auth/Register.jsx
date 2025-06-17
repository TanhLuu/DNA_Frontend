import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/auth/register.css';

const Register = () => {
  const { register, error, success } = useAuth();
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={(e) => { e.preventDefault(); register(form); }}>
        <h2>Đăng ký</h2>
        {['username', 'password', 'fullName', 'email', 'phone'].map((field) => (
          <input key={field} type={field === 'password' ? 'password' : 'text'} name={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} required value={form[field]} onChange={handleChange} />
        ))}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Đăng ký</button>
        <p>Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
      </form>
    </div>
  );
};

export default Register;
