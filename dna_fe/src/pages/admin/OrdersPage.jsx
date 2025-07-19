import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrders from '../../hooks/Order/useOrdersPage';
import STATUS_LABELS from '../../constants/orderStatusLabels';
import StatusFilterBar from '../../constants/StatusFilterBar'; // ✅ Thêm component lọc
import '../../styles/admin/ordersPage.css';

const OrdersPage = () => {
  const {
    filteredOrders,
    isLoading,
    error,
    accountData,
    serviceData
  } = useOrders();

  const [selectedStatus, setSelectedStatus] = useState(""); // ✅ Trạng thái đang chọn

  const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : 'Không có';
  const formatPrice = a => a ? a.toLocaleString('vi-VN') + ' VNĐ' : 'Không có';

  const navigate = useNavigate();
  const handleViewDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  if (isLoading) return <div className="admin-orders-loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="admin-orders-error">{error}</div>;

  // ✅ Bỏ đơn PENDING
  let nonPendingOrders = filteredOrders.filter(order => order.orderStatus !== 'PENDING');

  // ✅ Nếu có chọn trạng thái thì lọc thêm
  if (selectedStatus) {
    nonPendingOrders = nonPendingOrders.filter(order => order.orderStatus === selectedStatus);
  }

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-title">DANH SÁCH ĐƠN HÀNG</h2>

      {/* ✅ Thanh lọc trạng thái */}
      <StatusFilterBar
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <div className="admin-orders-table-wrapper">
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên khách</th>
              <th>Dịch vụ</th>
              <th>Mục đích</th>
              <th>Hình thức thu mẫu</th>
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
                  <td>{accountData[order.customerId]?.fullName || 'Không có'}</td>
                  <td>{serviceData[order.serviceId]?.serviceName || 'Không có'}</td>
                  <td>{serviceData[order.serviceId]?.serviceType || 'Không có'}</td>
                  <td>
                    <span className="admin-orders-pill">
                      {order.sampleMethod === 'center' ? 'Tại trung tâm' : 'Tự thu và gửi mẫu'}
                    </span>
                  </td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>{formatPrice(order.amount)}</td>
                  <td className={`admin-orders-status ${order.orderStatus}`}>
                    {STATUS_LABELS[order.orderStatus] || 'Không có'}
                  </td>
                  <td>
                    <button
                      className="admin-orders-action-btn"
                      onClick={() => handleViewDetails(order.orderId)}
                    >
                      Chi tiết đơn
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="admin-orders-empty">
                  Không có đơn hàng nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
