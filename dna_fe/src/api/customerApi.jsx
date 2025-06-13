import axios from 'axios';

export const createCustomer = async (accountId, profileData) => {
  const res = await axios.post('/api/customers', {
    accountId,
    ...profileData,
  });
  return res.data;
};


export const saveCustomerProfile = async (data) => {
  const response = await axios.put('/api/customers', data);
  return response.data;
};


export const getCustomerByAccountId = async (accountId) => {
  const res = await axios.get(`/api/customers/account/${accountId}`);
  return res.data;
};