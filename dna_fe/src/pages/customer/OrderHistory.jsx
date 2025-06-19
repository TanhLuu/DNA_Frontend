import React from 'react';
import '../../styles/customer/OrderHistory.css';
import useCustomerOrders from '../../hooks/useCustomerOrders';
import OrderFilterBar from '../../components/UI/Order/OrderFilterBar';
import { useNavigate } from 'react-router-dom';

const CustomerHistory = () => {
  const {
    filteredOrders,
    isLoading,
    error,
    serviceData,
    handleFilterChange
  } = useCustomerOrders();

  

  const getStatusClass = (status) => ({
    PENDING: 'status-pending',
    PREPARING: 'status-preparing',
    COLLECTING: 'status-collecting',
    TRANSFERRING: 'status-transferring',
    TESTING: 'status-testing',
    COMPLETED: 'status-completed',
  }[status] || '');

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

      <OrderFilterBar handleFilterChange={handleFilterChange} />

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
                <td>{serviceData[order.serviceId]?.servicePurpose || 'N/A'}</td>
                <td>{order.resultDeliverAddress || 'N/A'}</td>
                <td><span className="pill">{order.sampleType === 'center' ? 'Tại trung tâm' : 'Tự lấy mẫu'}</span></td>
                <td>{serviceData[order.serviceId]?.timeTest || 'N/A'} ngày</td>
                <td>{formatDate(order.orderDate)}</td>
                <td>{formatPrice(order.amount)}</td>
                <td className={`status ${getStatusClass(order.orderStatus)}`}>
                  {{
                    PENDING: 'Đặt lịch/Đăng ký',
                    PREPARING: 'Chuẩn bị lấy mẫu',
                    COLLECTING: 'Thu thập mẫu',
                    TRANSFERRING: 'Chuyển mẫu',
                    TESTING: 'Xét nghiệm',
                    COMPLETED: 'Hoàn thành'
                  }[order.orderStatus] || 'N/A'}
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

export default CustomerHistory;
