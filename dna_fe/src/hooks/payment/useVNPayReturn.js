import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmVNPayPayment } from '../../api/paymentApi'; // Adjust the import path as needed

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

        // Hàm chuyển đổi vnp_PayDate sang định dạng hiển thị
        const formatVNPayDate = (vnpPayDate) => {
          if (!vnpPayDate) return new Date().toLocaleString('vi-VN');
          // Định dạng vnp_PayDate: YYYYMMDDHHMMSS
          const year = vnpPayDate.slice(0, 4);
          const month = vnpPayDate.slice(4, 6);
          const day = vnpPayDate.slice(6, 8);
          const hour = vnpPayDate.slice(8, 10);
          const minute = vnpPayDate.slice(10, 12);
          const second = vnpPayDate.slice(12, 14);
          return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).toLocaleString('vi-VN');
        };

        // Nếu không có tham số, kiểm tra localStorage
        if ([...searchParams.entries()].length === 0) {
          const lastPayment = localStorage.getItem('lastPaymentTest');
          if (lastPayment) {
            const paymentInfo = JSON.parse(lastPayment);
            setPaymentStatus('info');
            setMessage('Đang hiển thị thông tin thanh toán gần nhất.');
            setPaymentData({
              transactionId: paymentInfo.transactionId || 'Không có',
              amount: paymentInfo.amount || 0,
              orderInfo: paymentInfo.orderInfo || 'Không có',
              bankCode: paymentInfo.bankCode || 'Không có',
              paymentTime: paymentInfo.timestamp
                ? new Date(paymentInfo.timestamp).toLocaleString('vi-VN')
                : paymentInfo.paymentTime || paymentInfo.time || new Date().toLocaleString('vi-VN'),
            });
          } else {
            setPaymentStatus('failed');
            setMessage('Không có thông tin giao dịch.');
          }
          return;
        }

        // Lấy thông tin từ VNPay
        const vnp_TxnRef = searchParams.get('vnp_TxnRef') || 'Không có';
        const vnp_Amount = searchParams.get('vnp_Amount') || '0';
        const vnp_OrderInfo = searchParams.get('vnp_OrderInfo') || 'Không có';
        const vnp_BankCode = searchParams.get('vnp_BankCode') || 'Không có';
        const vnp_PayDate = searchParams.get('vnp_PayDate') || new Date().toLocaleString('vi-VN');

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

        // Chuẩn hóa paymentData
        const paymentData = {
          transactionId: vnp_TxnRef,
          amount: parseInt(vnp_Amount) / 100,
          orderInfo: vnp_OrderInfo,
          bankCode: vnp_BankCode,
          paymentTime: formatVNPayDate(vnp_PayDate),
        };

        // Xử lý kết quả
        if (vnp_ResponseCode === '00') {
          setPaymentStatus('success');
          setMessage('Thanh toán thành công!');
          setPaymentData(paymentData);
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