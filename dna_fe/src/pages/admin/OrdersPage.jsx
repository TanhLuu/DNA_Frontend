import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin/ordersPage.css';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8080/api/testorders', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (err) {
        setError('Không thể tải danh sách đơn hàng: ' + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.orderStatus === filter));
    }
  }, [filter, orders]);

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  return { orders, setOrders, filteredOrders, isLoading, error, handleFilterChange };
};

const OrdersPage = () => {
  const { orders, setOrders, filteredOrders, isLoading, error, handleFilterChange } = useOrders();
  const [updateError, setUpdateError] = useState(null);

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'PREPARING': return 'status-preparing';
      case 'COLLECTING': return 'status-collecting';
      case 'TRANSFERRING': return 'status-transferring';
      case 'TESTING': return 'status-testing';
      case 'COMPLETED': return 'status-completed';
      default: return '';
    }
  };

  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : 'N/A';
  };

  const formatPrice = (amount) => {
    return amount ? amount.toLocaleString('vi-VN') + ' VNĐ' : 'N/A';
  };

  const getPurpose = (serviceId) => {
    return serviceId ? `Service ${serviceId}` : 'N/A';
  };

  const canUpdateOrder = (status, role) => {
    if (role === 'NORMAL_STAFF') {
      return ['PENDING', 'PREPARING', 'COLLECTING', 'TRANSFERRING'].includes(status);
    } else if (role === 'LAB_STAFF') {
      return ['TESTING', 'COMPLETED'].includes(status);
    }
    return false;
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = [
      'PENDING',
      'PREPARING',
      'COLLECTING',
      'TRANSFERRING',
      'TESTING',
      'COMPLETED'
    ];
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    return currentStatus;
  };

  const handleUpdateOrder = async (orderId, currentStatus) => {
    try {
      setUpdateError(null);
      const staffRole = localStorage.getItem('staffRole');
      if (!staffRole) {
        setUpdateError('Không tìm thấy vai trò nhân viên. Vui lòng đăng nhập lại.');
        return;
      }

      if (!canUpdateOrder(currentStatus, staffRole)) {
        setUpdateError(`Bạn không có quyền cập nhật đơn hàng ở trạng thái ${currentStatus}`);
        return;
      }

      const nextStatus = getNextStatus(currentStatus);
      if (nextStatus === currentStatus) {
        setUpdateError('Đơn hàng đã ở trạng thái cuối cùng!');
        return;
      }

      const updatedData = {
        staffId: localStorage.getItem('staffId'),
        orderStatus: nextStatus,
      };

      const response = await axios.put(`http://localhost:8080/api/testorders/${orderId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Cập nhật state thay vì tải lại trang
      setOrders(orders.map(order =>
        order.orderId === orderId ? { ...order, orderStatus: nextStatus } : order
      ));
      alert('Cập nhật đơn hàng thành công!');
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Cập nhật đơn hàng thất bại');
    }
  };

  const handleViewDetails = (orderId) => {
    alert(`Xem chi tiết đơn hàng ID: ${orderId}`);
  };

  if (isLoading) return <div className="orders-loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="orders-error text-red-500">{error}</div>;

  const staffRole = localStorage.getItem('staffRole');

  return (
    <div className="orders-container">
      {updateError && <div className="text-red-500 mb-4">{updateError}</div>}
      <div className="orders-buttons">
        <button className="btn btn-red" onClick={() => handleFilterChange('PENDING')}>Đặt lịch/Đăng ký</button>
        <button className="btn btn-gray" onClick={() => handleFilterChange('PREPARING')}>Chuẩn bị lấy mẫu</button>
        <button className="btn btn-yellow" onClick={() => handleFilterChange('COLLECTING')}>Thu thập mẫu</button>
        <button className="btn btn-light-blue" onClick={() => handleFilterChange('TRANSFERRING')}>Chuyển mẫu</button>
        <button className="btn btn-blue" onClick={() => handleFilterChange('TESTING')}>Xét nghiệm</button>
        <button className="btn btn-green" onClick={() => handleFilterChange('COMPLETED')}>Hoàn thành</button>
        <button className="btn btn-dark-blue" onClick={() => handleFilterChange('ALL')}>Tất cả</button>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Họ tên</th>
              <th>SĐT</th>
              <th>Email</th>
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
            {filteredOrders.map(order => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.customerId}</td>
                <td>{order.customerId}</td>
                <td>{order.customerId}</td>
                <td>{order.serviceId}</td>
                <td>{getPurpose(order.serviceId)}</td>
                <td>{order.resultDeliverAddress || 'N/A'}</td>
                <td><span className="pill">{order.sampleType === 'center' ? 'Tại trung tâm' : 'Tự lấy tại nhà'}</span></td>
                <td>{order.serviceId}</td>
                <td>{formatDate(order.orderDate)}</td>
                <td>{formatPrice(order.amount)}</td>
                <td className={`status ${getStatusClass(order.orderStatus)}`}>
                  {order.orderStatus === 'PENDING' ? 'Đặt lịch/Đăng ký' :
                   order.orderStatus === 'PREPARING' ? 'Chuẩn bị lấy mẫu' :
                   order.orderStatus === 'COLLECTING' ? 'Thu thập mẫu' :
                   order.orderStatus === 'TRANSFERRING' ? 'Chuyển mẫu' :
                   order.orderStatus === 'TESTING' ? 'Xét nghiệm' :
                   order.orderStatus === 'COMPLETED' ? 'Hoàn thành' : 'N/A'}
                </td>
                <td>
                  <button
  className="action-btn"
  onClick={() => handleUpdateOrder(order.orderId, order.orderStatus)}
  disabled={
    !canUpdateOrder(order.orderStatus, staffRole) ||
    (staffRole === 'NORMAL_STAFF' && getNextStatus(order.orderStatus) === 'TESTING')
  }
>
  Cập nhật đơn
</button>
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