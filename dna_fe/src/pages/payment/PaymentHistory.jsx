// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../../styles/payment/payment.css';

// const PaymentHistory = ({ customerId }) => {
//   const [payments, setPayments] = useState([]);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const fetchPayments = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error('Không tìm thấy token, yêu cầu đăng nhập');
//         navigate('/login');
//         return;
//       }

//       const res = await axios.get(`http://localhost:8080/api/payments/by-customer/${customerId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log('Dữ liệu thanh toán:', res.data); // Log để debug
//       setPayments(res.data);
//     } catch (error) {
//       console.error('Lỗi khi tải lịch sử thanh toán:', error);
//       if (error.response && error.response.status === 403) {
//         console.error('Token không hợp lệ hoặc hết hạn, điều hướng đến đăng nhập');
//         navigate('/login');
//       }
//     }
//   };

//   useEffect(() => {
//     if (customerId) {
//       fetchPayments();
//     }
//   }, [customerId, location.state?.refresh, navigate]);

//   // Ánh xạ trạng thái sang tiếng Việt
//   const mapStatusToVietnamese = (status) => {
//     switch (status) {
//       case 'SUCCESS':
//         return 'Thành công';
//       case 'FAILED':
//         return 'Thất bại';
//       case 'CANCELLED':
//         return 'Đã hủy';
//       case 'PENDING':
//         return 'Đang chờ';
//       default:
//         return status;
//     }
//   };

//   return (
//     <div style={{ maxWidth: '700px', margin: 'auto' }}>
//       <h2>Lịch sử thanh toán</h2>
//       <button
//         onClick={fetchPayments}
//         style={{
//           marginBottom: '1rem',
//           padding: '0.5rem 1rem',
//           backgroundColor: '#3B82F6',
//           color: 'white',
//           borderRadius: '0.25rem',
//           cursor: 'pointer',
//         }}
//       >
//         Làm mới
//       </button>
//       <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%' }}>
//         <thead>
//           <tr>
//             <th>Mã GD</th>
//             <th>Đơn hàng</th>
//             <th>Số tiền (VNĐ)</th>
//             <th>PT Thanh toán</th>
//             <th>Thời gian</th>
//             <th>Trạng thái</th>
//           </tr>
//         </thead>
//         <tbody>
//           {payments.map((p) => (
//             <tr key={p.paymentId}>
//               <td>{p.transactionId}</td>
//               <td>{p.orderId}</td>
//               <td>{p.amount.toLocaleString()}</td>
//               <td>{p.paymentMethod}</td>
//               <td>{p.paymentTime}</td>
//               <td>{mapStatusToVietnamese(p.paymentStatus)}</td>
//             </tr>
//           ))}
//           {payments.length === 0 && (
//             <tr>
//               <td colSpan="6" style={{ textAlign: 'center' }}>
//                 Chưa có giao dịch nào.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PaymentHistory;