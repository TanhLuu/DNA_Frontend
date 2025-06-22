import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/auth/payment.css'; 

const VNPayReturnPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Đang xác thực giao dịch...');

  useEffect(() => {
    const confirmPayment = async () => {
      const params = {};
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }

      try {
        // Gửi dữ liệu về backend xác thực giao dịch (nếu bạn có API /vnpay-return)
        const res = await axios.get('http://localhost:8080/api/payments/vnpay-return', { params });

        // Tuỳ backend trả gì, ở đây chỉ minh hoạ
        if (res.data.status === 'success') {
          setMessage('Thanh toán thành công!');
        } else {
          setMessage('Thanh toán thất bại!');
        }
      } catch (error) {
        console.error(error);
        setMessage('Lỗi khi xác thực giao dịch!');
      }
    };

    confirmPayment();
  }, [searchParams]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>{message}</h2>
    </div>
  );
};

export default VNPayReturnPage;
