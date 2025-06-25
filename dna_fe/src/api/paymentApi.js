import axiosInstance from './axiosInstance'; // Import axios instance đã cấu hình

// Gửi yêu cầu xác nhận kết quả thanh toán từ VNPay
export const confirmVNPayPayment = async (params) => {
  try {
    const response = await axiosInstance.get('/api/payments/vnpay-return', { params });
    return response.data;
  } catch (error) {
    throw new Error(`Lỗi khi xác nhận thanh toán: ${error.response?.data?.error || error.message}`);
  }
};

// Gửi yêu cầu tạo link thanh toán VNPay
export const createVNPayPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/api/payments/create-payment', paymentData);
    return response.data;
  } catch (error) {
    throw new Error(`Lỗi khi tạo link thanh toán: ${error.response?.data?.error || error.message}`);
  }
};