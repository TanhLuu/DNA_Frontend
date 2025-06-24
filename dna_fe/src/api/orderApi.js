import axiosInstance from './axiosInstance';

export const getAllTestOrders = async () => {
  const response = await axiosInstance.get('/api/testorders');
  return response.data;
};

export const createTestOrder = async (orderData) => {
  const response = await axiosInstance.post('/api/testorders', orderData);
  return response.data;
};

export const deleteTestOrder = async (orderId) => {
  const response = await axiosInstance.delete(`/api/testorders/${orderId}`);
  return response.data;
};