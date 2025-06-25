import React from 'react';
import { useNavigate } from 'react-router-dom';
import useOrders from '../../hooks/Order/useOrdersPage';
import STATUS_LABELS from '../../constants/orderStatusLabels';
import '../../styles/admin/ordersPage.css';

const OrdersPage = () => {
  const {
    orders,
    filteredOrders,
    isLoading,
    error,
    handleFilterChange,
    accountData,
    serviceData
  } = useOrders();

  const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : 'N/A';
  const formatPrice = a => a ? a.toLocaleString('vi-VN') + ' VNĐ' : 'N/A';

  const navigate = useNavigate();
  const handleViewDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  if (isLoading) return <div className="orders-loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="orders-error text-red-500">{error}</div>;

  const nonPendingOrders = filteredOrders.filter(order => order.orderStatus !== 'PENDING');

  return (
    <div className="orders-container">
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên khách</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Dịch vụ</th>
              <th>Mục đích</th>
              <th>Địa chỉ nhận kết quả</th>
              <th>Loại mẫu</th>
              <th>Thời gian xét nghiệm</th>
              <th>Ngày đặt</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {nonPendingOrders.length > 0 ? (
              nonPendingOrders.map(order => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{accountData[order.customerId]?.fullName || 'N/A'}</td>
                  <td>{accountData[order.customerId]?.phone || 'N/A'}</td>
                  <td>{accountData[order.customerId]?.email || 'N/A'}</td>
                  <td>{serviceData[order.serviceId]?.serviceName || 'N/A'}</td>
                  <td>{serviceData[order.serviceId]?.serviceType || 'N/A'}</td>
                  <td>{order.resultDeliverAddress || 'N/A'}</td>
                  <td><span className="pill">{order.sampleMethod === 'center' ? 'Tại trung tâm' : 'Tự lấy mẫu'}</span></td>
                  <td>{serviceData[order.serviceId]?.timeTest || 'N/A'} ngày</td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>{formatPrice(order.amount)}</td>
                  <td className={`status ${order.orderStatus}`}>
                    {STATUS_LABELS[order.orderStatus] || 'N/A'}
                  </td>
                  <td>
                    <button className="action-btn" onClick={() => handleViewDetails(order.orderId)}>Chi tiết đơn</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="text-center">Không có đơn hàng nào phù hợp</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
