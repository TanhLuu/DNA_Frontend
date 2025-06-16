// testSampleApi.js

import axiosInstance from './axiosInstance';

const BASE_URL = '/api/testSamples';

// Tạo mẫu xét nghiệm
export const createTestSample = async (data) => {
  const response = await axiosInstance.post(`${BASE_URL}`, data);
  return response.data;
};

// Lấy mẫu xét nghiệm theo ID
export const getTestSampleById = async (id) => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`);
  return response.data;
};
