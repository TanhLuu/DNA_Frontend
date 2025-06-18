import axiosInstance from './axiosInstance';

export const getAllTestOrders = async () => {
  const res = await axiosInstance.get('/api/testorders');
  return res.data;
};

export const getTestOrderById = async (id) => {
  const res = await axiosInstance.get(`/api/testorders/${id}`);
  return res.data;
};

export const createTestOrder = async (data) => {
  const res = await axiosInstance.post('/api/testorders', data);
  return res.data;
};

export const updateTestOrder = async (id, data) => {
  const res = await axiosInstance.put(`/api/testorders/${id}`, data);
  return res.data;
};

export const deleteTestOrder = async (id) => {
  const res = await axiosInstance.delete(`/api/testorders/${id}`);
  return res.data;
};

export const getTestOrdersByCustomerId = async (customerId) => {
  const res = await axiosInstance.get('/api/testorders');
  return res.data.filter(order => order.customerId == customerId);
};

export const getPendingTestOrders = async () => {
  const res = await axiosInstance.get('/api/testorders');
  return res.data.filter(order => order.orderStatus === "PENDING");
};

export const getCompletedTestOrders = async () => {
  const res = await axiosInstance.get('/api/testorders');
  return res.data.filter(order => order.orderStatus === "COMPLETED");
};