import { useState } from 'react';
import { loginUser, registerUser, createStaff, resetPasswordAuthenticated, resetPasswordWithToken } from '../api/authApi';
import { getCustomerByAccountId } from '../api/accountApi';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const saveAccountToLocalStorage = (account, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('accountId', account.id);
    localStorage.setItem('username', account.username);
    localStorage.setItem('role', account.role?.toUpperCase() || '');
    localStorage.setItem('fullName', account.fullName || '');
    localStorage.setItem('email', account.email || '');
    localStorage.setItem('phone', account.phone || '');
    
    window.dispatchEvent(new Event('storage'));
  };

  const login = async (username, password) => {
  setError('');
  try {
    const res = await loginUser(username, password);
    const { account, token } = res.data;

    if (!token) throw new Error('Token không tồn tại');
    saveAccountToLocalStorage(account, token);

    const role = account.role?.toUpperCase();

    if (role === 'STAFF' || role === 'ADMIN') {
      navigate('/ordersPageAdmin', { replace: true });
    } else if (role === 'CUSTOMER') {
      try {
        const customerRes = await getCustomerByAccountId(account.id);
        const customerId = customerRes?.data?.id;

        // 👉 Lưu thêm customerId vào localStorage
        if (customerId) {
          localStorage.setItem('customerId', customerId);
        }

        customerId
          ? navigate('/', { replace: true }) // đã có hồ sơ → về trang chủ
          : navigate('/profile', { replace: true }); // chưa có hồ sơ → bắt cập nhật
      } catch {
        navigate('/profile', { replace: true });
      }
    } else {
      navigate('/');
    }
  } catch (err) {
    setError(err.response?.data?.message || err.message || 'Đăng nhập thất bại');
  }
};


  const register = async (form) => {
    setError('');
    setSuccess('');
    try {
      await registerUser(form);
      await login(form.username, form.password);
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const registerStaff = async (form, callback) => {
    setError('');
    setSuccess('');
    try {
      await createStaff(form);
      setSuccess('Tạo tài khoản nhân viên thành công!');
      callback?.();
    } catch (err) {
      setError(err.response?.data || 'Tạo tài khoản thất bại');
    }
  };

  const resetPassword = async (newPassword) => {
    setError('');
    setSuccess('');
    try {
      const res = await resetPasswordAuthenticated(newPassword);
      setSuccess(res);
    } catch (err) {
      setError(err.response?.data || 'Đổi mật khẩu thất bại');
    }
  };

  const resetPasswordWithEmailToken = async (token, newPassword) => {
    setError('');
    setSuccess('');
    try {
      const res = await resetPasswordWithToken(token, newPassword);
      setSuccess(res);
      localStorage.removeItem('resetToken');
    } catch (err) {
      setError(err.response?.data || err.message || 'Đặt lại mật khẩu thất bại');
    }
  };

  return {
    login,
    register,
    registerStaff,
    resetPassword,
    resetPasswordWithEmailToken,
    error,
    success,
    setError,
    setSuccess
  };
};
