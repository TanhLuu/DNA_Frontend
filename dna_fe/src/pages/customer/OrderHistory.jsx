import React from 'react';
import '../../styles/customer/OrderHistory.css';
import useCustomerOrders from '../../hooks/Order/useOrderHistory';

import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const {
    filteredOrders,
    isLoading,
    error,
    serviceData,
    handleFilterChange
  } = useCustomerOrders();

  const STATUS_LABELS = {
    PENDING: "Đang chờ thanh toán",                  // Đơn hàng mới tạo, chưa xử lý
    CONFIRM: "Đặt lịch / Đăng ký",           // Đơn hàng vừa được tạo, chờ xử lý
    SEND_KIT: "Đã gửi kit",                  // Đã gửi bộ kit lấy mẫu cho khách hàng
    SEND_SAMPLE: "Đã gửi mẫu lại trung tâm", // Khách hàng đã gửi mẫu về trung tâm
    COLLECT_SAMPLE: "Đã thu mẫu",            // Đã thu mẫu tại trung tâm hoặc tại nhà
    TESTED: "Đã xét nghiệm",                 // Đã hoàn thành xét nghiệm
    COMPLETED: "Hoàn thành"                  // Đã trả kết quả, hoàn tất đơn hàng
  };

  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : 'N/A';
  const formatPrice = (amount) => amount ? amount.toLocaleString('vi-VN') + ' VNĐ' : 'N/A';

  const navigate = useNavigate();

  const handleViewDetails = (orderId) => {
    navigate(`/customer/orders/${orderId}`);
  };

  if (isLoading) return <div className="orders-loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="orders-error text-red-500">{error}</div>;

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
            {filteredOrders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{serviceData[order.serviceId]?.serviceName || 'N/A'}</td>
                <td>{serviceData[order.serviceId]?.serviceType || 'N/A'}</td>
                <td>{order.resultDeliverAddress || 'N/A'}</td>
                <td><span className="pill">{order.sampleMethod === 'center' ? 'Tại trung tâm' : 'Tự lấy mẫu'}</span></td>
                <td>{serviceData[order.serviceId]?.timeTest || 'N/A'} ngày</td>
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