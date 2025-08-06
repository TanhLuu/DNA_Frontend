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

      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        setError('Không nhận được link thanh toán từ server.');
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      setError('Đã xảy ra lỗi khi gửi yêu cầu thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  return { orderId, customerId, customerName, amount, loading, error, handlePayment };
};

export default usePayment;
