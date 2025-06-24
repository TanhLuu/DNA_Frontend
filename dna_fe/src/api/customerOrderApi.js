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

export const updateAccountInfo = async (accountId, accountData) => {
  const response = await axiosInstance.put(`/api/account/${accountId}`, accountData);
  return response.data;
};

export const updateTestOrder = async (orderId, orderData) => {
  const response = await axiosInstance.put(`/api/testorders/${orderId}`, orderData);
  return response.data;
};

export const updateTestSample = async (sampleId, sampleData) => {
  const response = await axiosInstance.put(`/api/testSamples/${sampleId}`, sampleData);
  return response.data;
};

export const getOrdersByCustomerId = async (customerId) => {
  const response = await axiosInstance.get(`/api/testorders/customer/${customerId}`);
  return response.data;
};