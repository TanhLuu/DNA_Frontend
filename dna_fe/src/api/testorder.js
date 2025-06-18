import axiosInstance from './axiosInstance';

export const getAllTestOrders = async () => {
  try {
    const res = await axiosInstance.get('/api/testorders');
    console.log('getAllTestOrders response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error in getAllTestOrders:', error);
    throw error;
  }
};


export const getTestOrderById = async (id) => {
  try {
    const res = await axiosInstance.get(`/api/testorders/${id}`);
    console.log(`getTestOrderById(${id}) response:`, res.data);
    return res.data;
  } catch (error) {
    console.error('Error in getTestOrderById:', error);
    throw error;
  }
};

export const createTestOrder = async (data) => {
  try {
    console.log('Creating test order with data:', data);

    // Ensure the data is formatted correctly for the backend
    const formattedData = {
      customerId: data.customerId, // Backend expects Long type
      serviceId: data.serviceId,   // Backend expects Long type
      orderDate: data.orderDate,   // Make sure this is in a format the backend expects
      sampleType: data.sampleType,
      orderStatus: data.orderStatus,
      resultDeliveryMethod: data.resultDeliveryMethod,
      resultDeliverAddress: data.resultDeliverAddress,
      kitCode: data.kitCode,
      sampleQuantity: data.sampleQuantity,
      amount: data.amount
    };

    console.log('Formatted data for API call:', formattedData);
    const res = await axiosInstance.post('/api/testorders', formattedData);
    console.log('createTestOrder response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error in createTestOrder:', error);
    // Add more detailed error logging
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

// Other existing functions...

export const updateTestOrder = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/api/testorders/${id}`, data);
    console.log(`updateTestOrder(${id}) response:`, res.data);
    return res.data;
  } catch (error) {
    console.error('Error in updateTestOrder:', error);
    throw error;
  }
};

export const deleteTestOrder = async (id) => {
  try {
    const res = await axiosInstance.delete(`/api/testorders/${id}`);
    console.log(`deleteTestOrder(${id}) response:`, res.data);
    return res.data;
  } catch (error) {
    console.error('Error in deleteTestOrder:', error);
    throw error;
  }
};

// Client-side filtering for features not supported by the backend
export const getTestOrdersByCustomerId = async (customerId) => {
  try {
    // Since your backend doesn't have a dedicated endpoint for filtering by customerId,
    // we'll fetch all orders and filter on the client side
    const res = await axiosInstance.get('/api/testorders');
    const filteredOrders = res.data.filter(order =>
      order.customerId = customerId // Using == for type coercion if needed
    );
    console.log(`getTestOrdersByCustomerId(${customerId}) filtered orders:`, filteredOrders);
    return filteredOrders;
  } catch (error) {
    console.error('Error in getTestOrdersByCustomerId:', error);
    throw error;
  }
};

export const getPendingTestOrders = async () => {
  try {
    // Since your backend doesn't have a dedicated endpoint for filtering by status,
    // we'll fetch all orders and filter on the client side
    const res = await axiosInstance.get('/api/testorders');
    const pendingOrders = res.data.filter(order => order.orderStatus === "PENDING");
    console.log('getPendingTestOrders filtered orders:', pendingOrders);
    return pendingOrders;
  } catch (error) {
    console.error('Error in getPendingTestOrders:', error);
    throw error;
  }
};

export const getCompletedTestOrders = async () => {
  try {
    // Since your backend doesn't have a dedicated endpoint for filtering by status,
    // we'll fetch all orders and filter on the client side
    const res = await axiosInstance.get('/api/testorders');
    const completedOrders = res.data.filter(order => order.orderStatus === "COMPLETED");
    console.log('getCompletedTestOrders filtered orders:', completedOrders);
    return completedOrders;
  } catch (error) {
    console.error('Error in getCompletedTestOrders:', error);
    throw error;
  }
};