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


export const getAllCivilServices = async () => {
  const res = await axiosInstance.get('/api/services');
  return res.data.filter(service => service.serviceType === "Dân sự");
};

export const getAllLegalServices = async () => {
  const res = await axiosInstance.get('/api/services');
  return res.data.filter(service => service.serviceType === "Hành chính");
};

export const toggleServiceActive = async (id) => {
  const response = await axiosInstance.put(`/api/services/${id}/toggle-active`);
  return response.data;
};