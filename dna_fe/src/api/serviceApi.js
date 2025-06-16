import axiosInstance from './axiosInstance';

export const getAllServices = async () => {
  const res = await axiosInstance.get('/api/services');
  return res.data;
};

export const createService = async (data) => {
  const res = await axiosInstance.post('/api/services', data);
  return res.data;
};

export const updateService = async (id, data) => {
  const res = await axiosInstance.put(`/api/services/${id}`, data);
  return res.data;
};

export const deleteService = async (id) => {
  const res = await axiosInstance.delete(`/api/services/${id}`);
  return res.data;
};
