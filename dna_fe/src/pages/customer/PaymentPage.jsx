import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      const { orderId, customerId, amount } = location.state;
      setOrderId(orderId);
      setCustomerId(customerId);
      setAmount(amount);
    }
  }, [location.state]);

  const handlePayment = async () => {
    if (!orderId || !customerId || !amount) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/payments/create-payment', {
        orderId,
        customerId,
        amount: parseInt(amount),
      });
      window.location.href = res.data.paymentUrl;
    } catch (error) {
      alert('Tạo thanh toán thất bại.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Thanh toán VNPay</h2>
      <div>
        <label>Order ID:</label>
        <input value={orderId} readOnly />
      </div>
      <div>
        <label>Customer ID:</label>
        <input value={customerId} readOnly />
      </div>
      <div>
        <label>Số tiền (VNĐ):</label>
        <input value={amount} readOnly />
      </div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Thanh toán qua VNPay'}
      </button>
    </div>
  );
};

export default PaymentPage;
