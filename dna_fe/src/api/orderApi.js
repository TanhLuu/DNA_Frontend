import axiosInstance from './axiosInstance';

export const getAllTestOrders = async () => {
  const response = await axiosInstance.get('/api/testorders');
  return response.data;
};

export const getAccountByCustomerId = async (customerId) => {
  const response = await axiosInstance.get(`/api/customers/${customerId}`);
  return response.data;
};

export const getServiceById = async (serviceId) => {
  const response = await axiosInstance.get(`/api/services/${serviceId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, updateData) => {
  const response = await axiosInstance.put(`/api/testorders/${orderId}`, updateData);
  return response.data;
};

export const getTestOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/api/testorders/${orderId}`);
  return response.data;
};