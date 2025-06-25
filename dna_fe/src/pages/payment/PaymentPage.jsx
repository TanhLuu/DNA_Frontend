import React from 'react';
import usePayment from '../../hooks/payment/usePayment';
import '../../styles/payment/payment.css';

const PaymentPage = () => {
  const { orderId, customerId, customerName, amount, loading, error, handlePayment } = usePayment();

  return (
    <div className="payment-page">
    <div className="payment-container">
      <h2 className="payment-title">Thanh toán VNPay</h2>

      {error && (
        <div className="payment-error">
          {error}
        </div>
      )}

      <div className="payment-field">
        <label className="payment-label">Mã đơn hàng:</label>
        <input
          value={orderId}
          readOnly
          className="payment-input"
        />
      </div>
      <div className="payment-field">
        <label className="payment-label">Tên khách hàng:</label>
        <input
          value={customerName}
          readOnly
          className="payment-input"
        />
      </div>
      <div className="payment-field">
        <label className="payment-label">Customer ID:</label>
        <input
          value={customerId}
          readOnly
          className="payment-input"
        />
      </div>
      <div className="payment-amount-field">
        <label className="payment-label">Số tiền (VNĐ):</label>
        <input
          value={amount}
          readOnly
          className="payment-input"
        />
      </div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`payment-button ${loading ? 'payment-button-disabled' : 'payment-button-enabled'}`}
      >
        {loading ? 'Đang xử lý...' : 'Thanh toán qua VNPay'}
      </button>
    </div>
    </div>
  );
};

export default PaymentPage;