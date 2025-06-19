import React from 'react';
import { useNavigate } from 'react-router-dom';
import useOrders from '../../hooks/useOrders';
import OrderFilterBar from '../../components/UI/Order/OrderFilterBar';
import axios from 'axios';
import '../../styles/admin/ordersPage.css';

const OrdersPage = () => {
  const {
    orders, setOrders, filteredOrders,
    isLoading, error, handleFilterChange,
    accountData, serviceData
  } = useOrders();

  const [updateError, setUpdateError] = React.useState(null);

  const getStatusClass = status => ({
    PENDING: 'status-pending',
    PREPARING: 'status-preparing',
    COLLECTING: 'status-collecting',
    TRANSFERRING: 'status-transferring',
    TESTING: 'status-testing',
    COMPLETED: 'status-completed',
  }[status] || '');

  const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : 'N/A';
  const formatPrice = a => a ? a.toLocaleString('vi-VN') + ' VNĐ' : 'N/A';

  const canUpdateOrder = (status, role) => {
    const normal = ['PENDING', 'PREPARING', 'COLLECTING', 'TRANSFERRING'];
    const lab = ['TRANSFERRING', 'TESTING', 'COMPLETED'];
    return role === 'NORMAL_STAFF' ? normal.includes(status)
      : role === 'LAB_STAFF' ? lab.includes(status)
        : false;
  };

  const getNextStatus = status => {
    const flow = ['PENDING', 'PREPARING', 'COLLECTING', 'TRANSFERRING', 'TESTING', 'COMPLETED'];
    const i = flow.indexOf(status);
    return i >= 0 && i < flow.length - 1 ? flow[i + 1] : status;
  };

  const handleUpdateOrder = async (orderId, currentStatus) => {
    setUpdateError(null);
    const staffRole = localStorage.getItem('staffRole');
    if (!staffRole) return setUpdateError('Không tìm thấy vai trò nhân viên. Vui lòng đăng nhập lại.');
    if (!canUpdateOrder(currentStatus, staffRole))
      return setUpdateError(`Bạn không có quyền cập nhật đơn hàng ở trạng thái ${currentStatus}`);

    const next = getNextStatus(currentStatus);
    if (next === currentStatus) return setUpdateError('Đơn hàng đã ở trạng thái cuối cùng!');

    try {
      await axios.put(`http://localhost:8080/api/testorders/${orderId}`,
        { staffId: localStorage.getItem('staffId'), orderStatus: next },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      setOrders(orders.map(o => o.orderId === orderId ? { ...o, orderStatus: next } : o));
      alert('Cập nhật đơn hàng thành công!');
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Cập nhật đơn hàng thất bại');
    }
  };
  const navigate = useNavigate();
  const handleViewDetails = (orderId) => {
    navigate(`/customer/orders/${orderId}`);
  };

  if (isLoading) return <div className="orders-loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="orders-error text-red-500">{error}</div>;

  const staffRole = localStorage.getItem('staffRole');

  return (
    <div className="orders-container">
      {updateError && <div className="text-red-500 mb-4">{updateError}</div>}
      <OrderFilterBar handleFilterChange={handleFilterChange} />
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
            {filteredOrders.map(order => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{accountData[order.customerId]?.fullName || 'N/A'}</td>
                <td>{accountData[order.customerId]?.phone || 'N/A'}</td>
                <td>{accountData[order.customerId]?.email || 'N/A'}</td>
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
                  <button
                    className="action-btn"
                    onClick={() => handleUpdateOrder(order.orderId, order.orderStatus)}
                    disabled={
                      !canUpdateOrder(order.orderStatus, staffRole) ||
                      (staffRole === 'NORMAL_STAFF' && getNextStatus(order.orderStatus) === 'TESTING')
                    }
                  >Cập nhật đơn</button>
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

export default OrdersPage;
