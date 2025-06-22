import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import '../../../styles/auth/register.css';

const CreateStaff = ({ onClose }) => {
  const { registerStaff, error, success } = useAuth();
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'STAFF',
    staffType: 'NORMAL_STAFF',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerStaff(form, () => {
      setTimeout(() => {
        onClose();
      }, 2000);
    });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Tạo tài khoản nhân viên</h2>
          {['username', 'password', 'fullName', 'email', 'phone'].map((field) => (
            <input key={field} type={field === 'password' ? 'password' : 'text'} name={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} required value={form[field]} onChange={handleChange} />
          ))}
          <select name="staffType" value={form.staffType} onChange={handleChange}>
            <option value="NORMAL_STAFF">Nhân viên thường</option>
            <option value="LAB_STAFF">Nhân viên xét nghiệm</option>
          </select>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <div className="popup-buttons">
            <button type="submit">Tạo tài khoản</button>
            <button type="button" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStaff;
