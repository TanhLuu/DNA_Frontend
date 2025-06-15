import axiosInstance from './axiosInstance';

const BASE_URL = '/auth';

// Đăng nhập
export const loginUser = async (username, password) => {
  const response = await axiosInstance.post(`${BASE_URL}/login`, { username, password });
  return response;
};

// Đăng ký
export const registerUser = async (userData) => {
  const response = await axiosInstance.post(`${BASE_URL}/register`, userData);
  return response.data;
};

// Quên mật khẩu - gửi link đặt lại mật khẩu
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post(`${BASE_URL}/forgot-password`, { email });
  return response.data;
};

// Đặt lại mật khẩu từ email với token (không yêu cầu xác thực)
export const resetPasswordWithToken = async (token, newPassword) => {
  const response = await axiosInstance.post(`${BASE_URL}/reset-password`, {
    token,
    newPassword,
  });
  return response.data;
};

// Đổi mật khẩu khi đã đăng nhập (yêu cầu xác thực)
export const resetPasswordAuthenticated = async (newPassword) => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.post(`${BASE_URL}/reset-password`, {
    token,
    newPassword,
  });
  return response.data;
};
