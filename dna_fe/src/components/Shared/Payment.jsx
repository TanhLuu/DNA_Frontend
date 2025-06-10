import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/payment.css';

const Payment = ({ orderCode, amount, qrImage, isSuccess = false, isLoading = false }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  const handlePaymentConfirm = () => {
    navigate(`/payment/complete/${orderCode}`);
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        {!isSuccess ? (
          <>
            <div className="qr-section">
              <img src={qrImage} alt="QR Code" className="qr-code" />
              <div className="qr-number">1234 5678 9101 1121</div>
            </div>
            <div className="payment-details">
              <h3>NỘI DUNG THANH TOÁN</h3>
              <div className="payment-info">
                <p>Thanh toán dịch vụ xét nghiệm</p>
                <p>#{orderCode}</p>
              </div>
              <div className="amount-section">
                <p>Tổng tiền:</p>
                <p className="amount">{amount?.toLocaleString()} VND</p>
              </div>
              <button className="pay-button" onClick={handlePaymentConfirm}>
                Tôi đã thanh toán
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Payment;