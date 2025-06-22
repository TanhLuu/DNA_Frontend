// src/api/accountApi.js

import axios from 'axios';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:8080/api';

// === Account APIs ===

export const fetchAccountInfo = async () => {
  const response = await axiosInstance.get('/api/account/me');
  return response.data;
};

export const updateAccountInfo = async (accountId, accountData) => {
  const response = await axiosInstance.put(`/api/account/${accountId}`, accountData);
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

export const getStaffById = async (staffId) => {
  const response = await axiosInstance.get(`/api/staff/${staffId}`);
  return response.data;
};

// === Account from Customer ===

export const getAccountByCustomerId = async (customerId) => {
  const customerRes = await axiosInstance.get(`/api/customers/${customerId}`);
  const accountId = customerRes.data.accountId;
  const accountRes = await axiosInstance.get(`/api/account/${accountId}`);
  return accountRes.data;
};

export const getAccountById = async (accountId) => {
  const response = await axiosInstance.get(`/api/account/${accountId}`);
  return response.data;
};

export const getCustomerById = async (customerId) => {
  const response = await axiosInstance.get(`/api/customers/${customerId}`);
  return response.data;
};

// === Service APIs ===

export const getServiceById = async (serviceId) => {
  const response = await axiosInstance.get(`/api/services/${serviceId}`);
  return response.data;
};

// === Test Order APIs ===

export const getOrdersByCustomerId = async (customerId) => {
  const response = await axiosInstance.get(`/api/testorders/customer/${customerId}`);
  return response.data;
};

export const getTestSamplesByOrderId = async (orderId) => {
  const response = await axiosInstance.get(`/api/testSamples/order/${orderId}`);
  return response.data;
};
