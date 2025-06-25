import axiosInstance from './axiosInstance';

export const getTestOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/api/testorders/${orderId}`);
  return response.data;
};

export const getTestSamplesByOrderId = async (orderId) => {
  const response = await axiosInstance.get(`/api/testSamples/order/${orderId}`);
  return response.data;
};

export const getTestResultsByOrderId = async (orderId) => {
  const response = await axiosInstance.get(`/api/test-results/order/${orderId}`);
  return response.data;
};

export const getTestResultSamplesByOrderId = async (orderId) => {
  const response = await axiosInstance.get(`/api/test-result-samples/order/${orderId}`);
  return response.data;
};

export const getAccountByCustomerId = async (customerId) => {
  const customerRes = await axiosInstance.get(`/api/customers/${customerId}`);
  const accountId = customerRes.data.accountId;
  const accountRes = await axiosInstance.get(`/api/account/${accountId}`);
  return accountRes.data;
};

export const getCustomerById = async (customerId) => {
  const response = await axiosInstance.get(`/api/customers/${customerId}`);
  return response.data;
};

export const getServiceById = async (serviceId) => {
  const response = await axiosInstance.get(`/api/services/${serviceId}`);
  return response.data;
};

export const getStaffById = async (staffId) => {
  const response = await axiosInstance.get(`/api/staff/${staffId}`);
  return response.data;
};

export const getAccountById = async (accountId) => {
  const response = await axiosInstance.get(`/api/account/${accountId}`);
  return response.data;
};

export const createTestSample = async (sampleData) => {
  const response = await axiosInstance.post('/api/testSamples', sampleData);
  return response.data;
};

export const updateTestOrder = async (orderId, orderData) => {
  const response = await axiosInstance.put(`/api/testorders/${orderId}`, orderData);
  return response.data;
};