

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TestPayment = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('preparing');
  const [error, setError] = useState('');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "9704198526191432198", 
    cardName: "NGUYEN VAN A",
    issueDate: "07/15"
  });

  useEffect(() => {
    const runTest = async () => {
      try {
        // Kiểm tra đăng nhập
        const token = localStorage.getItem('token');
        const customerId = localStorage.getItem('customerId');
        
        if (!token || !customerId) {
          setStatus('error');
          setError('Bạn cần đăng nhập trước khi test thanh toán!');
          return;
        }

        setStatus('sending');
        
        // Chuẩn bị dữ liệu test
        const orderId = Math.floor(Math.random() * 1000) + 1; // Random order ID để test
        const testData = {
          orderId: orderId,
          customerId: parseInt(customerId),
          amount: 10000 // 10,000 VND để test
        };

        console.log('Gửi yêu cầu thanh toán với dữ liệu:', testData);
        
        // Gửi yêu cầu tạo thanh toán
        const response = await axios.post(
          'http://localhost:8080/api/payments/create-payment',
          testData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Phản hồi thanh toán:', response.data);
        
        if (response.data && response.data.paymentUrl) {
          setStatus('redirecting');
          
          localStorage.setItem('lastPaymentTest', JSON.stringify({
            transactionId: response.data.transactionId || Date.now().toString(),
            orderId: orderId,
            amount: testData.amount,
            timestamp: new Date().toISOString(),
            bankCode: "NCB" // Ngân hàng NCB cho test
          }));
          
          // Chờ 1 giây rồi redirect
          setTimeout(() => {
            window.location.href = response.data.paymentUrl;
          }, 1000);
        } else {
          setStatus('error');
          setError('Không nhận được URL thanh toán từ server.');
        }
      } catch (error) {
        console.error('Lỗi test thanh toán:', error);
        setStatus('error');
        setError(error.response?.data?.error || error.message);
      }
    };

    runTest();
  }, [navigate]);

  return (
    <div style={{ maxWidth: '600px', margin: '100px auto', padding: '30px', textAlign: 'center',
         backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Test Thanh Toán VNPay</h1>
      
      {status === 'preparing' && (
        <div>
          <div className="loading-spinner"></div>
          <p>Đang chuẩn bị dữ liệu thanh toán...</p>
        </div>
      )}
      
      {status === 'sending' && (
        <div>
          <div className="loading-spinner"></div>
          <p>Đang gửi yêu cầu thanh toán...</p>
        </div>
      )}
      
      {status === 'redirecting' && (
        <div>
          <div className="redirect-icon">→</div>
          <p>Đang chuyển đến trang thanh toán VNPay...</p>
          <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h3>Thông tin thẻ test</h3>
            <p><strong>Số thẻ:</strong> {cardInfo.cardNumber}</p>
            <p><strong>Tên chủ thẻ:</strong> {cardInfo.cardName}</p>
            <p><strong>Ngày phát hành:</strong> {cardInfo.issueDate}</p>
            <p><strong>OTP:</strong> 123456</p>
          </div>
        </div>
      )}
      
      {status === 'error' && (
        <div>
          <div className="error-icon">!</div>
          <p style={{ color: '#f44336', marginBottom: '20px' }}>Lỗi: {error}</p>
          <button onClick={() => navigate('/')} className="back-button">
            Về trang chủ
          </button>
        </div>
      )}
      
      <style>{`
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 1s linear infinite;
        }
        
        .redirect-icon {
          width: 60px;
          height: 60px;
          background-color: #e6f7ff;
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
        }
        
        .error-icon {
          width: 60px;
          height: 60px;
          background-color: #ffebee;
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          color: #f44336;
        }
        
        .back-button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TestPayment;