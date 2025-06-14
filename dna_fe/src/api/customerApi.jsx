import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const createCustomer = (data) => {
  return axios.post(`${BASE_URL}/customers`, data);
};

// Không cần sửa các hàm dưới nếu chưa dùng
export const saveCustomerProfile = async (data) => {
  const response = await axios.put(`${BASE_URL}/customers/${data.id}`, data);
  return response.data;
};

export const getCustomerByAccountId = async (accountId) => {
  const res = await axios.get(`${BASE_URL}/auth/account/${accountId}`);
  return res.data;
};
