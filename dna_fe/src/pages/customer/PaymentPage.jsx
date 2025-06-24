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
    // Lấy dữ liệu từ location.state hoặc localStorage
    const state = location.state;
    if (state) {
      const { orderId, customerId, amount } = state;
      setOrderId(orderId);
      setCustomerId(customerId);
      setAmount(amount);
      localStorage.setItem('paymentData', JSON.stringify({ orderId, customerId, amount }));
    } else {
      const saved = localStorage.getItem('paymentData');
      if (saved) {
        const data = JSON.parse(saved);
        setOrderId(data.orderId);
        setCustomerId(data.customerId);
        setAmount(data.amount);
      }
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
    <div style={{ maxWidth: '500px', margin: 'auto', paddingTop: '100px' }}>
      <h2 className="text-xl font-bold mb-4">Thanh toán VNPay</h2>
      {!orderId || !customerId || !amount ? (
        <p className="text-red-500">Không có thông tin thanh toán.</p>
      ) : (
        <>
          <div className="mb-2">
            <label>Order ID:</label>
            <input value={orderId} readOnly className="border w-full p-2" />
          </div>
          <div className="mb-2">
            <label>Customer ID:</label>
            <input value={customerId} readOnly className="border w-full p-2" />
          </div>
          <div className="mb-4">
            <label>Số tiền (VNĐ):</label>
            <input value={amount} readOnly className="border w-full p-2" />
          </div>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? 'Đang xử lý...' : 'Thanh toán qua VNPay'}
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentPage;
