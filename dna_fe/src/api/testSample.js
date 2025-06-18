import axiosInstance from './axiosInstance';

/**
 * Creates a new test sample
 * @param {Object} data - The test sample data
 * @returns {Promise<Object>} - The created test sample
 */
export const createTestSample = async (data) => {
  try {
    console.log('Creating test sample with data:', data);
    const response = await axiosInstance.post('/api/testSamples', data);
    console.log('createTestSample response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in createTestSample:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

/**
 * Gets all test samples
 * @returns {Promise<Array>} - Array of test samples
 */
export const getAllTestSamples = async () => {
  try {
    const response = await axiosInstance.get('/api/testSamples');
    console.log('getAllTestSamples response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getAllTestSamples:', error);
    throw error;
  }
};

/**
 * Gets a test sample by its ID
 * @param {number} id - The test sample ID
 * @returns {Promise<Object>} - The test sample
 */
export const getTestSampleById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/testSamples/${id}`);
    console.log(`getTestSampleById(${id}) response:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getTestSampleById:', error);
    throw error;
  }
};

/**
 * Updates an existing test sample
 * @param {number} id - The test sample ID
 * @param {Object} data - The updated test sample data
 * @returns {Promise<Object>} - The updated test sample
 */
export const updateTestSample = async (id, data) => {
  try {
    console.log(`Updating test sample ${id} with data:`, data);
    const response = await axiosInstance.put(`/api/testSamples/${id}`, data);
    console.log(`updateTestSample(${id}) response:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error in updateTestSample:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

/**
 * Deletes a test sample
 * @param {number} id - The test sample ID
 * @returns {Promise<void>}
 */
export const deleteTestSample = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/testSamples/${id}`);
    console.log(`deleteTestSample(${id}) response:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error in deleteTestSample:', error);
    throw error;
  }
};

/**
 * Gets test samples by order ID
 * @param {number} orderId - The order ID
 * @returns {Promise<Array>} - Array of test samples for the specified order
 */
export const getTestSamplesByOrderId = async (orderId) => {
  try {
    // Since the backend doesn't have a specific endpoint for this,
    // we'll fetch all samples and filter them client-side
    const response = await axiosInstance.get('/api/testSamples');
    const filteredSamples = response.data.filter(sample => 
      sample.orderId === orderId || Number(sample.orderId) === Number(orderId)
    );
    console.log(`getTestSamplesByOrderId(${orderId}) filtered samples:`, filteredSamples);
    return filteredSamples;
  } catch (error) {
    console.error('Error in getTestSamplesByOrderId:', error);
    throw error;
  }
};

/**
 * Gets test samples by customer ID
 * @param {number} customerId - The customer ID
 * @returns {Promise<Array>} - Array of test samples for the specified customer
 */
export const getTestSamplesByCustomerId = async (customerId) => {
  try {
    // Since the backend doesn't have a specific endpoint for this,
    // we'll fetch all samples and filter them client-side
    const response = await axiosInstance.get('/api/testSamples');
    const filteredSamples = response.data.filter(sample => 
      sample.customerId === customerId || Number(sample.customerId) === Number(customerId)
    );
    console.log(`getTestSamplesByCustomerId(${customerId}) filtered samples:`, filteredSamples);
    return filteredSamples;
  } catch (error) {
    console.error('Error in getTestSamplesByCustomerId:', error);
    throw error;
  }
};