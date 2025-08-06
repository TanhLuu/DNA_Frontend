import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmVNPayPayment } from '../../api/paymentApi';

const useVNPayReturn = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [paymentData, setPaymentData] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');

        // Nếu không có mã phản hồi -> không có dữ liệu từ VNPay -> lỗi
        if (!vnp_ResponseCode) {
          setPaymentStatus('failed');
          setMessage('Không nhận được thông tin thanh toán.');
          return;
        }

        const formatVNPayDate = (vnpPayDate) => {
          if (!vnpPayDate) return new Date().toLocaleString('vi-VN');
          const year = vnpPayDate.slice(0, 4);
          const month = vnpPayDate.slice(4, 6);
          const day = vnpPayDate.slice(6, 8);
          const hour = vnpPayDate.slice(8, 10);
          const minute = vnpPayDate.slice(10, 12);
          const second = vnpPayDate.slice(12, 14);
          return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).toLocaleString('vi-VN');
        };

        const vnp_TxnRef = searchParams.get('vnp_TxnRef') || 'Không có';
        const vnp_Amount = searchParams.get('vnp_Amount') || '0';
        const vnp_OrderInfo = searchParams.get('vnp_OrderInfo') || 'Không có';
        const vnp_BankCode = searchParams.get('vnp_BankCode') || 'Không có';
        const vnp_PayDate = searchParams.get('vnp_PayDate');

        const params = Object.fromEntries(searchParams.entries());
        await confirmVNPayPayment(params);

        const paymentData = {
          transactionId: vnp_TxnRef,
          amount: parseInt(vnp_Amount) / 100,
          orderInfo: vnp_OrderInfo,
          bankCode: vnp_BankCode,
          paymentTime: formatVNPayDate(vnp_PayDate),
        };

        if (vnp_ResponseCode === '00') {
          setPaymentStatus('success');
          setMessage('Thanh toán thành công!');
          setPaymentData(paymentData);
        } else {
          setPaymentStatus('failed');
          setMessage('Đã xảy ra lỗi khi xử lý kết quả thanh toán.');
          setPaymentData(paymentData);
        }
      } catch (error) {
        console.error('Error processing payment result:', error);
        setPaymentStatus('failed');
        setMessage('Đã xảy ra lỗi khi xử lý kết quả thanh toán.');
      }
    };

    confirmPayment();
  }, [searchParams]);

  const goToHome = () => navigate('/');
  const goToOrderHistory = () => navigate('/OrderHistory', { state: { refresh: true } });
  const retryPayment = () => navigate('/payment');
  const testAgain = () => navigate('/test-payment');

  return { paymentStatus, message, paymentData, goToHome, goToOrderHistory, retryPayment, testAgain };
};

export default useVNPayReturn;
