import { useState } from 'react';
import {
  loginUser,
  registerUser,
  createStaff,
  resetPasswordAuthenticated,
  resetPasswordWithToken
} from '../api/authApi';
import {
  getCustomerByAccountId,
  getStaffByAccountId
} from '../api/accountApi';
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
      const { account, token } = await loginUser(username, password); // ✅ bỏ .data

      if (!token) throw new Error('Token không tồn tại');
      saveAccountToLocalStorage(account, token);

      const role = account.role?.toUpperCase();

      if (role === 'STAFF') {
        try {
          const staff = await getStaffByAccountId(account.id); // ✅ bỏ .data
          if (staff?.id) localStorage.setItem('staffId', staff.id);
          if (staff?.role) localStorage.setItem('staffRole', staff.role);
        } catch (err) {
          console.warn('Không thể lấy staffId hoặc staffRole', err);
        }

        navigate('/ordersPageAdmin', { replace: true });
      } else if (role === 'CUSTOMER') {
        try {
          const customer = await getCustomerByAccountId(account.id); // ✅ bỏ .data
          if (customer?.id) {
            localStorage.setItem('customerId', customer.id);
            navigate('/', { replace: true });
          } else {
            navigate('/profile', { replace: true });
          }
        } catch {
          navigate('/profile', { replace: true });
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Đăng nhập thất bại');
    }
  };

  const register = async (form) => {
    setError('');
    setSuccess('');
    try {
      await registerUser(form); // ✅ bỏ .data
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
      await createStaff(form); // ✅ bỏ .data
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
      const res = await resetPasswordAuthenticated(newPassword); // ✅ bỏ .data
      setSuccess(res);
    } catch (err) {
      setError(err.response?.data || 'Đổi mật khẩu thất bại');
    }
  };

  const resetPasswordWithEmailToken = async (token, newPassword) => {
    setError('');
    setSuccess('');
    try {
      const res = await resetPasswordWithToken(token, newPassword); // ✅ bỏ .data
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
