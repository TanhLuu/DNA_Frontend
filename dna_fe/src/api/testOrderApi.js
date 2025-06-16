import axiosInstance from './axiosInstance';

export const createTestOrder = async (data) => {
  const res = await axiosInstance.post('/api/testorders', data);
  return res.data;
};