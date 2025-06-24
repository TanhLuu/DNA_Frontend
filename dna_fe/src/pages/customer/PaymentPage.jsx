import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // URL backend
  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
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
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Lấy token từ localStorage - rất quan trọng vì backend yêu cầu xác thực JWT
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thanh toán');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // Dữ liệu cần gửi - cần chuyển sang số theo đúng kiểu trong database
      const paymentData = {
        orderId: parseInt(orderId),
        customerId: parseInt(customerId),
        amount: parseInt(amount)
      };

      console.log('Gửi yêu cầu thanh toán:', paymentData);
      
      // Gửi yêu cầu với token Authorization
      const response = await axios.post(`${API_BASE_URL}/api/payments/create-payment`, paymentData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Phản hồi thanh toán:', response.data);
      
      if (response.data && response.data.paymentUrl) {
        // Chuyển hướng đến trang thanh toán VNPay
        window.location.href = response.data.paymentUrl;
      } else {
        setError('Không nhận được link thanh toán từ server.');
      }
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      
      if (error.response) {
        // Xử lý theo mã lỗi
        if (error.response.status === 403) {
          setError('Truy cập bị từ chối. Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
          // Chuyển hướng đến trang đăng nhập
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

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', paddingTop: '100px' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Thanh toán VNPay</h2>
      
      {error && (
        <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '12px', marginBottom: '16px', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Order ID:</label>
        <input 
          value={orderId} 
          onChange={(e) => setOrderId(e.target.value)}
          style={{ 
            border: '1px solid #D1D5DB', 
            width: '100%', 
            padding: '0.5rem' 
          }} 
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Customer ID:</label>
        <input 
          value={customerId} 
          onChange={(e) => setCustomerId(e.target.value)}
          style={{ 
            border: '1px solid #D1D5DB', 
            width: '100%', 
            padding: '0.5rem' 
          }} 
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Số tiền (VNĐ):</label>
        <input 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          style={{ 
            border: '1px solid #D1D5DB', 
            width: '100%', 
            padding: '0.5rem' 
          }} 
        />
      </div>
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{ 
          backgroundColor: loading ? '#93C5FD' : '#3B82F6',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          width: '100%',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Đang xử lý...' : 'Thanh toán qua VNPay'}
      </button>
    </div>
  );
};

export default PaymentPage;