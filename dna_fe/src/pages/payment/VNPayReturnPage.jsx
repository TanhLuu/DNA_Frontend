import React from 'react';
import useVNPayReturn from '../../hooks/payment/useVNPayReturn';
import '../../styles/payment/vnpay-return.css';

const VNPayReturnPage = () => {
  const { paymentStatus, message, paymentData, goToHome, goToOrderHistory, retryPayment, testAgain } = useVNPayReturn();

  return (
    <div className="vnpay-return-page">
    <div className="vnpay-container">
      {paymentStatus === 'pending' && (
        <div className="vnpay-pending">
          <div className="vnpay-pending-icon">⏳</div>
          <h2 className="vnpay-pending-title">{message}</h2>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="vnpay-success-container">
          <div className="vnpay-success-icon">✓</div>
          <h2 className="vnpay-success-title">Thanh toán thành công!</h2>
          {paymentData && (
            <div className="vnpay-success-details">
              <p><strong>Mã giao dịch:</strong> {paymentData.transactionId}</p>
              <p><strong>Số tiền:</strong> {paymentData.amount?.toLocaleString('vi-VN')} VNĐ</p>
              {paymentData.orderInfo && <p><strong>Nội dung:</strong> {paymentData.orderInfo}</p>}
              {paymentData.bankCode && <p><strong>Ngân hàng:</strong> {paymentData.bankCode}</p>}
              <p><strong>Thời gian:</strong> {paymentData.time}</p>
            </div>
          )}
          <div className="vnpay-button-group">
            <button
              onClick={goToOrderHistory}
              className="vnpay-button-primary"
            >
              Xem đơn hàng
            </button>
            <button
              onClick={goToHome}
              className="vnpay-button-secondary"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="vnpay-failed-container">
          <div className="vnpay-failed-icon">✕</div>
          <h2 className="vnpay-failed-title">Thanh toán thất bại</h2>
          <p className="vnpay-failed-message">{message}</p>
          {paymentData && (
            <div className="vnpay-failed-details">
              <p><strong>Mã giao dịch:</strong> {paymentData.transactionId}</p>
              <p><strong>Số tiền:</strong> {paymentData.amount?.toLocaleString('vi-VN')} VNĐ</p>
              {paymentData.orderInfo && <p><strong>Nội dung:</strong> {paymentData.orderInfo}</p>}
              {paymentData.bankCode && <p><strong>Ngân hàng:</strong> {paymentData.bankCode}</p>}
              <p><strong>Thời gian:</strong> {paymentData.time}</p>
            </div>
          )}
          <div className="vnpay-button-group">
            <button
              onClick={retryPayment}
              className="vnpay-button-primary"
            >
              Thử lại
            </button>
            <button
              onClick={goToHome}
              className="vnpay-button-secondary"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      )}

      {paymentStatus === 'info' && (
        <div className="vnpay-info-container">
          <div className="vnpay-info-icon">i</div>
          <h2 className="vnpay-info-title">Thông tin thanh toán</h2>
          {paymentData && (
            <div className="vnpay-info-details">
              <p><strong>Thông tin giao dịch gần nhất:</strong></p>
              {paymentData.transactionId && <p><strong>Mã giao dịch:</strong> {paymentData.transactionId}</p>}
              {paymentData.amount && <p><strong>Số tiền:</strong> {paymentData.amount?.toLocaleString('vi-VN')} VNĐ</p>}
              {paymentData.bankCode && <p><strong>Ngân hàng:</strong> {paymentData.bankCode}</p>}
              {paymentData.timestamp && <p><strong>Thời gian:</strong> {new Date(paymentData.timestamp).toLocaleString()}</p>}
            </div>
          )}
          <div className="vnpay-button-group">
            <button
              onClick={testAgain}
              className="vnpay-button-primary"
            >
              Test thanh toán
            </button>
            <button
              onClick={goToHome}
              className="vnpay-button-secondary"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default VNPayReturnPage;