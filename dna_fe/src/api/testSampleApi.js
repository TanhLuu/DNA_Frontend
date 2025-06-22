import axiosInstance from './axiosInstance';

export const createTestSample = async (sampleData) => {
  const res = await axiosInstance.post('/api/testSamples', sampleData);
  return res.data;
};
