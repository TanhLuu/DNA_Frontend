import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import '../../styles/payment/payment.css';

const VNPayReturnPage = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [message, setMessage] = useState('Đang xác thực giao dịch...');
  const [paymentData, setPaymentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // Kiểm tra dữ liệu trả về từ VNPay
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');

        // Nếu không có response code, có thể trang được load trực tiếp
        if ([...searchParams.entries()].length === 0) {
          const lastPayment = localStorage.getItem('lastPaymentTest');
          if (lastPayment) {
            const paymentInfo = JSON.parse(lastPayment);
            setPaymentStatus('info');
            setMessage('Đang hiển thị thông tin thanh toán gần nhất.');
            setPaymentData(paymentInfo);
          } else {
            setPaymentStatus('failed');
            setMessage('Không có thông tin giao dịch.');
          }
          return;
        }

        // Lấy các thông tin khác từ VNPay
        const vnp_TxnRef = searchParams.get('vnp_TxnRef');
        const vnp_Amount = searchParams.get('vnp_Amount');
        const vnp_OrderInfo = searchParams.get('vnp_OrderInfo');
        const vnp_BankCode = searchParams.get('vnp_BankCode');

        console.log('VNPay response:', {
          code: vnp_ResponseCode,
          txnRef: vnp_TxnRef,
          amount: vnp_Amount,
          bankCode: vnp_BankCode,
        });

        // Xử lý kết quả dựa trên response code
        if (vnp_ResponseCode === '00') {
          // Thanh toán thành công
          setPaymentStatus('success');
          setMessage('Thanh toán thành công!');
          setPaymentData({
            transactionId: vnp_TxnRef,
            amount: vnp_Amount ? parseInt(vnp_Amount) / 100 : 0,
            orderInfo: vnp_OrderInfo,
            bankCode: vnp_BankCode,
            time: searchParams.get('vnp_PayDate') || new Date().toLocaleString(),
          });

          // Thông báo backend về kết quả
          try {
            const params = {};
            for (const [key, value] of searchParams.entries()) {
              params[key] = value;
            }
            await axios.get('http://localhost:8080/api/payments/vnpay-return', { params });
            console.log('Backend updated successfully');
          } catch (err) {
            console.error('Failed to update backend:', err);
          }
        } else {
          // Thanh toán thất bại
          setPaymentStatus('failed');

          // Hiển thị thông báo lỗi
          let errorMessage = '';
          switch (vnp_ResponseCode) {
            case '24':
              errorMessage = 'Giao dịch không thành công do: Khách hàng hủy giao dịch';
              break;
            case '09':
              errorMessage =
                'Giao dịch không thành công do: Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking';
              break;
            case '10':
              errorMessage =
                'Giao dịch không thành công do: Xác thực thẻ/tài khoản không đúng quá 3 lần';
              break;
            case '11':
              errorMessage = 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán';
              break;
            case '12':
              errorMessage = 'Giao dịch không thành công do: Thẻ/Tài khoản bị khóa';
              break;
            case '51':
              errorMessage = 'Giao dịch không thành công do: Tài khoản không đủ số dư';
              break;
            case '07':
              errorMessage = 'Giao dịch bị nghi ngờ gian lận';
              break;
            case '05':
              errorMessage = 'Giao dịch không thành công do: Số tiền vượt quá hạn mức';
              break;
            default:
              errorMessage = `Giao dịch không thành công, mã lỗi: ${vnp_ResponseCode}`;
          }

          setMessage(errorMessage);

          // Thông báo backend về kết quả
          try {
            const params = {};
            for (const [key, value] of searchParams.entries()) {
              params[key] = value;
            }
            await axios.get('http://localhost:8080/api/payments/vnpay-return', { params });
          } catch (err) {
            console.error('Failed to update backend:', err);
          }
        }
      } catch (error) {
        console.error('Error processing payment result:', error);
        setPaymentStatus('failed');
        setMessage('Đã xảy ra lỗi khi xử lý kết quả thanh toán.');
      }
    };

    confirmPayment();
  }, [searchParams, navigate]);

  const goToHome = () => {
    navigate('/');
  };

  const goToOrderHistory = () => {
    navigate('/OrderHistory', { state: { refresh: true } }); // Truyền state refresh
  };

  const retryPayment = () => {
    navigate('/payment');
  };

  const testAgain = () => {
    navigate('/test-payment');
  };

  return (
    <div className="payment-result-container">
      {/* Hiển thị khi đang xử lý */}
      {paymentStatus === 'pending' && (
        <div className="payment-result-card">
          <div className="loading-spinner"></div>
          <h2>{message}</h2>
        </div>
      )}

      {/* Hiển thị khi thanh toán thành công */}
      {paymentStatus === 'success' && (
        <div className="payment-result-card success">
          <div className="status-icon success">✓</div>
          <h2>Thanh toán thành công!</h2>

          {paymentData && (
            <div className="payment-details">
              <p>
                <strong>Mã giao dịch:</strong> {paymentData.transactionId}
              </p>
              <p>
                <strong>Số tiền:</strong>{' '}
                {paymentData.amount?.toLocaleString('vi-VN')} VNĐ
              </p>
              {paymentData.orderInfo && (
                <p>
                  <strong>Nội dung:</strong> {paymentData.orderInfo}
                </p>
              )}
              {paymentData.bankCode && (
                <p>
                  <strong>Ngân hàng:</strong> {paymentData.bankCode}
                </p>
              )}
              <p>
                <strong>Thời gian:</strong> {paymentData.time}
              </p>
            </div>
          )}

          <div className="button-group">
            <button className="primary-button" onClick={goToOrderHistory}>
              Xem đơn hàng
            </button>
            <button className="secondary-button" onClick={goToHome}>
              Về trang chủ
            </button>
          </div>
        </div>
      )}

      {/* Hiển thị khi thanh toán thất bại */}
      {paymentStatus === 'failed' && (
        <div className="payment-result-card error">
          <div className="status-icon error">✕</div>
          <h2>Thanh toán thất bại</h2>
          <p className="error-message">{message}</p>

          <div className="button-group">
            <button className="primary-button" onClick={retryPayment}>
              Thử lại
            </button>
            <button className="secondary-button" onClick={goToHome}>
              Về trang chủ
            </button>
          </div>
        </div>
      )}

      {/* Hiển thị khi chỉ hiện thông tin */}
      {paymentStatus === 'info' && (
        <div className="payment-result-card info">
          <div className="status-icon info">i</div>
          <h2>Thông tin thanh toán</h2>

          {paymentData && (
            <div className="payment-details">
              <p>
                <strong>Thông tin giao dịch gần nhất:</strong>
              </p>
              {paymentData.transactionId && (
                <p>
                  <strong>Mã giao dịch:</strong> {paymentData.transactionId}
                </p>
              )}
              {paymentData.amount && (
                <p>
                  <strong>Số tiền:</strong>{' '}
                  {paymentData.amount?.toLocaleString('vi-VN')} VNĐ
                </p>
              )}
              {paymentData.bankCode && (
                <p>
                  <strong>Ngân hàng:</strong> {paymentData.bankCode}
                </p>
              )}
              {paymentData.timestamp && (
                <p>
                  <strong>Thời gian:</strong>{' '}
                  {new Date(paymentData.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          )}

          <div className="button-group">
            <button className="primary-button" onClick={testAgain}>
              Test thanh toán
            </button>
            <button className="secondary-button" onClick={goToHome}>
              Về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VNPayReturnPage;