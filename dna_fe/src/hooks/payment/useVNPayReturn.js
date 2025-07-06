import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmVNPayPayment } from '../../api/paymentApi';

const useVNPayReturn = () => {
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

        // Nếu không có tham số, kiểm tra localStorage
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
        const vnp_TxnRef = searchParams.get('vnp_TxnRef') || 'Không có';
        const vnp_Amount = searchParams.get('vnp_Amount') || '0';
        const vnp_OrderInfo = searchParams.get('vnp_OrderInfo') || 'Không có';
        const vnp_BankCode = searchParams.get('vnp_BankCode') || 'Không có';
        const vnp_PayDate = searchParams.get('vnp_PayDate') || new Date().toLocaleString();

        console.log('VNPay response:', {
          code: vnp_ResponseCode,
          txnRef: vnp_TxnRef,
          amount: vnp_Amount,
          bankCode: vnp_BankCode,
        });

        // Gửi thông tin về backend
        const params = Object.fromEntries(searchParams.entries());
        await confirmVNPayPayment(params);
        console.log('Backend updated successfully');

        // Xử lý kết quả dựa trên response code
        if (vnp_ResponseCode === '00') {
          setPaymentStatus('success');
          setMessage('Thanh toán thành công!');
          setPaymentData({
            transactionId: vnp_TxnRef,
            amount: parseInt(vnp_Amount) / 100,
            orderInfo: vnp_OrderInfo,
            bankCode: vnp_BankCode,
            time: vnp_PayDate,
          });
        } else {
          setPaymentStatus('failed');
          let errorMessage = '';
          switch (vnp_ResponseCode) {
            case '24':
              errorMessage = 'Giao dịch không thành công do: Khách hàng hủy giao dịch';
              break;
            case '09':
              errorMessage = 'Giao dịch không thành công do: Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking';
              break;
            case '10':
              errorMessage = 'Giao dịch không thành công do: Xác thực thẻ/tài khoản không đúng quá 3 lần';
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
              errorMessage = vnp_ResponseCode
                ? `Giao dịch không thành công, mã lỗi: ${vnp_ResponseCode}`
                : 'Giao dịch không thành công do lỗi không xác định';
          }
          setMessage(errorMessage);
          setPaymentData({
            transactionId: vnp_TxnRef,
            amount: parseInt(vnp_Amount) / 100,
            orderInfo: vnp_OrderInfo,
            bankCode: vnp_BankCode,
            time: vnp_PayDate,
          });
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