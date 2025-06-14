import axiosInstance from './axiosInstance';

const BASE_URL = '/auth';

export const loginUser = async (username, password) => {
  const response = await axiosInstance.post(`${BASE_URL}/login`, { username, password });
  return response;

};

export const registerUser = async (userData) => {
  const response = await axiosInstance.post(`${BASE_URL}/register`, userData);
  return response.data;
};

// Quên mật khẩu
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post(`${BASE_URL}/forgot-password`, { email });
  return response.data;
};

// Validate reset token
export const validateResetToken = async (token) => {
  const response = await axiosInstance.get(`${BASE_URL}/validate-reset-token`, { params: { token }});
  return response.data;
};


export const changePassword = async (newPassword) => {
  const response = await axiosInstance.post(`${BASE_URL}/reset-password`, { 
    newPassword 
  });
  return response.data;
};