import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/customer/payment.css'; 

const PaymentPage = () => {
  const [orderId, setOrderId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

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

      const paymentUrl = res.data.paymentUrl;
      window.location.href = paymentUrl;
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
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
      </div>
      <div>
        <label>Customer ID:</label>
        <input
          type="text"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
      </div>
      <div>
        <label>Số tiền (VNĐ):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Thanh toán qua VNPay'}
      </button>
    </div>
  );
};

export default PaymentPage;
