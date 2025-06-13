import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/services';

export const getAllServices = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const getServiceById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const createService = async (serviceData) => {
  const res = await axios.post(BASE_URL, serviceData);
  return res.data;
};

export const updateService = async (id, serviceData) => {
  const res = await axios.put(`${BASE_URL}/${id}`, serviceData);
  return res.data;
};

export const deleteService = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
