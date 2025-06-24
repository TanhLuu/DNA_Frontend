import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/payment/payment.css'; // Thêm file CSS nếu cần
const PaymentHistory = ({ customerId }) => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/payments/by-customer/${customerId}`);
        setPayments(res.data);
      } catch (error) {
        console.error('Lỗi khi tải lịch sử thanh toán:', error);
      }
    };

    if (customerId) {
      fetchPayments();
    }
  }, [customerId]);

  return (
    <div style={{ maxWidth: '700px', margin: 'auto' }}>
      <h2>Lịch sử thanh toán</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Mã GD</th>
            <th>Đơn hàng</th>
            <th>Số tiền (VNĐ)</th>
            <th>PT Thanh toán</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.paymentId}>
              <td>{p.transactionId}</td>
              <td>{p.orderId}</td>
              <td>{p.amount.toLocaleString()}</td>
              <td>{p.paymentMethod}</td>
              <td>{p.paymentTime}</td>
              <td>{p.paymentStatus}</td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Chưa có giao dịch nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
