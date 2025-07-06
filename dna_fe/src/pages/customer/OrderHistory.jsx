import React from 'react';
import '../../styles/customer/OrderHistory.css';
import useCustomerOrders from '../../hooks/Order/useOrderHistory';
import { useNavigate } from 'react-router-dom';
import STATUS_LABELS from '../../constants/orderStatusLabels';

const OrderHistory = () => {
  const {
    filteredOrders,
    isLoading,
    error,
    serviceData,
    handleFilterChange
  } = useCustomerOrders();

  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : 'Không có';
  const formatPrice = (amount) => amount ? amount.toLocaleString('vi-VN') + ' VNĐ' : 'Không có';

  const navigate = useNavigate();

  const handleViewDetails = (orderId) => {
    navigate(`/customer/orders/${orderId}`);
  };

  if (isLoading) return <div className="orders-loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="orders-error text-red-500">{error}</div>;

  const nonPendingOrders = filteredOrders.filter(order => order.orderStatus !== 'PENDING');

  return (
    <div className="customer-orders-container">
      <h2 className="text-2xl font-bold mb-4">Đơn hàng</h2>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Loại XN ADN</th>
              <th>Mục đích</th>
              <th>Địa chỉ</th>
              <th>Hình thức thu mẫu</th>
              <th>Thời gian trả kết quả</th>
              <th>Ngày đăng ký</th>
              <th>Tổng phí</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {nonPendingOrders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{serviceData[order.serviceId]?.serviceName || 'Không có'}</td>
                <td>{serviceData[order.serviceId]?.serviceType || 'Không có'}</td>
                <td>{order.resultDeliverAddress || 'Không có'}</td>
                <td><span className="pill">{order.sampleMethod === 'center' ? 'Tại trung tâm' : 'Tự thu và gửi mẫu'}</span></td>
                <td>{serviceData[order.serviceId]?.timeTest || 'Không có'} ngày</td>
                <td>{formatDate(order.orderDate)}</td>
                <td>{formatPrice(order.amount)}</td>
                <td className={`status ${order.orderStatus}`}>
                  {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                </td>
                <td>
                  <button className="action-btn" onClick={() => handleViewDetails(order.orderId)}>Chi tiết đơn</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
