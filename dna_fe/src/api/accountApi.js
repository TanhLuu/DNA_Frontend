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

export const getAccountByCustomerId = async (customerId) => {
  try {
    // Lấy CustomerDTO để có accountId
    const customerRes = await axiosInstance.get(`/api/customers/${customerId}`);
    const accountId = customerRes.data.accountId;
    if (!accountId) {
      throw new Error('Không tìm thấy accountId cho customer này');
    }
    // Lấy AccountDTO
    const accountRes = await axiosInstance.get(`/api/account/${accountId}`);
    return accountRes.data;
  } catch (error) {
    console.error(`Lỗi khi lấy tài khoản cho customerId ${customerId}:`, error);
    throw error;
  }
};

export const getServiceById = async (serviceId) => {
  try {
    const response = await axiosInstance.get(`/api/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy dịch vụ ${serviceId}:`, error);
    throw error;
  }
};

export const getStaffById = async (staffId) => {
  const response = await axiosInstance.get(`/api/staff/${staffId}`);
  return response.data;
};


// === Test Order APIs (Thêm mới) ===
export const getOrdersByCustomerId = async (customerId) => {
  try {
    const response = await axiosInstance.get(`/api/testorders/customer/${customerId}`);
    return response;
  } catch (error) {
    console.error(`Lỗi khi lấy đơn hàng cho customerId ${customerId}:`, error);
    throw error;
  }
};


export const getTestSamplesByOrderId = async (orderId) => {
  const res = await axiosInstance.get(`/api/testSamples/order/${orderId}`);
  return res.data;
};

export const getAccountById = async (accountId) => {
  const res = await axiosInstance.get(`/api/account/${accountId}`);
  return res.data;
};
