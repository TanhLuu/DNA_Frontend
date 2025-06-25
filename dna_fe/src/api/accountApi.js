import axios from 'axios';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:8080/api';

// === Account APIs ===
export const fetchAccountInfo = async () => {
  const response = await axiosInstance.get('/api/account/me');
  return response.data;
};

// === Customer APIs ===
export const getCustomerByAccountId = async (accountId) => {
  const response = await axiosInstance.get(`/api/customers/account/${accountId}`);
  return response.data;
};

export const createCustomer = async (customerData) => {
  const response = await axiosInstance.post('/api/customers', customerData);
  return response.data;
};

export const updateCustomer = async (customerId, customerData) => {
  const response = await axiosInstance.put(`/api/customers/${customerId}`, customerData);
  return response.data;
};

// Public version (không cần token)
export const getCustomerByAccountIdPublic = async (accountId) => {
  const response = await axios.get(`${BASE_URL}/auth/account/${accountId}`);
  return response.data;
};

export const saveCustomerProfile = async (data) => {
  const response = await axios.put(`${BASE_URL}/customers/${data.id}`, data);
  return response.data;
};

// === Staff APIs ===
export const getStaffByAccountId = async (accountId) => {
  const response = await axiosInstance.get(`/api/staff/account/${accountId}`);
  return response.data;
};