import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createVNPayPayment } from '../../api/paymentApi';

const usePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const state = location.state;
    if (state) {
      const { orderId, customerId, customerName, amount } = state;
      setOrderId(orderId);
      setCustomerId(customerId);
      setCustomerName(customerName || '');
      setAmount(amount);
      localStorage.setItem('paymentData', JSON.stringify({ orderId, customerId, customerName, amount }));
    } else {
      const saved = localStorage.getItem('paymentData');
      if (saved) {
        const data = JSON.parse(saved);
        setOrderId(data.orderId);
        setCustomerId(data.customerId);
        setCustomerName(data.customerName || '');
        setAmount(data.amount);
      }
    }
  }, [location.state]);

  const handlePayment = async () => {
    if (!orderId || !customerId || !amount) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thanh toán');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const paymentData = {
        orderId: parseInt(orderId),
        customerId: parseInt(customerId),
        amount: parseInt(amount),
      };

      console.log('Gửi yêu cầu thanh toán:', paymentData);

      const response = await createVNPayPayment(paymentData);

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        setError('Không nhận được link thanh toán từ server.');
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      if (error.response) {
        if (error.response.status === 403) {
          setError('Truy cập bị từ chối. Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.response.status === 404) {
          setError('Không tìm thấy API thanh toán. Vui lòng kiểm tra URL kết nối.');
        } else {
          setError(`Lỗi máy chủ: ${error.response.data?.error || error.response.status}`);
        }
      } else if (error.request) {
        setError('Không nhận được phản hồi từ máy chủ thanh toán. Vui lòng kiểm tra kết nối mạng.');
      } else {
        setError(`Lỗi kết nối: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return { orderId, customerId, customerName, amount, loading, error, handlePayment };
};

export default usePayment;