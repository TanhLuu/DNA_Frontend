import axiosInstance from './axiosInstance';

const BASE_URL = '/auth';

// Đăng nhập
export const loginUser = async (username, password) => {
  const response = await axiosInstance.post(`${BASE_URL}/login`, { username, password });
  return response.data; 
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

// Đặt lại mật khẩu từ email với token
export const resetPasswordWithToken = async (token, newPassword) => {
  const response = await axiosInstance.post(
    `http://localhost:8080/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`
  );
  return response.data;
};


// Đổi mật khẩu khi đã đăng nhập
export const resetPasswordAuthenticated = async (newPassword) => {
  const token = localStorage.getItem('token');
  const response = await axiosInstance.post(`/auth/reset-password?token=${token}&newPassword=${newPassword}`);
  return response.data;
};

// Tạo tài khoản nhân viên
export const createStaff = async (staffData) => {
  const response = await axiosInstance.post('/auth/create-staff', staffData);
  return response.data;
};
