// src/api/accountService.js

import axios from 'axios';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:8080/api';

// === Account APIs (dùng axiosInstance để có Authorization header) ===
export const fetchAccountInfo = () => {
  return axiosInstance.get('/api/account/me');
};

export const updateAccountInfo = (accountId, accountData) => {
  return axiosInstance.put(`/api/account/${accountId}`, accountData);
};

// === Customer APIs ===

// Lấy customer theo accountId
export const getCustomerByAccountId = async (accountId) => {
  const res = await axiosInstance.get(`/api/customers/account/${accountId}`);
  return res;
};

// Tạo mới customer
export const createCustomer = (customerData) => {
  return axiosInstance.post('/api/customers', customerData);
};

// Cập nhật customer
export const updateCustomer = (customerId, customerData) => {
  return axiosInstance.put(`/api/customers/${customerId}`, customerData);
};

// (Tùy chọn) nếu cần dùng cách gọi không có token:
export const getCustomerByAccountIdPublic = async (accountId) => {
  const res = await axios.get(`${BASE_URL}/auth/account/${accountId}`);
  return res.data;
};

export const saveCustomerProfile = async (data) => {
  const response = await axios.put(`${BASE_URL}/customers/${data.id}`, data);
  return response.data;
};


export const getStaffByAccountId = async (accountId) => {
  const response = await axiosInstance.get(`/api/staff/account/${accountId}`);
  return response.data; // StaffDTO
};
