// src/api/orderSampleApi.js
import axiosInstance from './axiosInstance';

export const createTestOrder = async (orderData) => {
  const response = await axiosInstance.post('/api/testorders', orderData);
  return response.data;
};

export const createTestSample = async (sampleData) => {
  const response = await axiosInstance.post('/api/testSamples', sampleData);
  return response.data;
};
