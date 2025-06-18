import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/customer/CustomerHistory.css'; // Cập nhật đường dẫn đến file CSS
import { getAccountByCustomerId, getServiceById , getOrdersByCustomerId } from '../../api/accountApi';

const useCustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accountData, setAccountData] = useState({});
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
  const fetchOrdersAndData = async () => {
    try {
      setIsLoading(true);
      const customerId = localStorage.getItem('customerId');
      if (!customerId) {
        throw new Error('Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại.');
      }

      // Lấy danh sách đơn hàng của khách hàng
      const response = await getOrdersByCustomerId(customerId); // Sử dụng hàm mới
      const ordersData = response.data;
      setOrders(ordersData);

      // Lấy thông tin tài khoản của khách hàng
      const accountResponse = await getAccountByCustomerId(customerId);
      const account = accountResponse.data;
      setAccountData({
        fullName: account.fullName || 'N/A',
        phone: account.phone || 'N/A',
        email: account.email || 'N/A',
      });

      // Lấy thông tin dịch vụ
        const servicePromises = ordersData.map(async (order) => {
          try {
            if (!order.serviceId) {
              return {
                serviceId: order.serviceId,
                serviceName: 'N/A',
                servicePurpose: 'N/A',
                timeTest: 'N/A',
              };
            }
            const serviceResponse = await getServiceById(order.serviceId);
            const service = serviceResponse.data;
            return {
              serviceId: order.serviceId,
              serviceName: service.serviceName || 'N/A',
              servicePurpose: service.servicePurpose || 'N/A',
              timeTest: service.timeTest || 'N/A',
            };
          } catch (err) {
            console.error(`Lỗi khi lấy dịch vụ ${order.serviceId}:`, err);
            return {
              serviceId: order.serviceId,
              serviceName: 'N/A',
              servicePurpose: 'N/A',
              timeTest: 'N/A',
            };
          }
        });

      const services = await Promise.all(servicePromises);
      const serviceMap = services.reduce((acc, service) => {
        acc[service.serviceId] = service;
        return acc;
      }, {});
      setServiceData(serviceMap);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };
  fetchOrdersAndData();
}, []);

  return { orders, isLoading, error, accountData, serviceData };
};

const CustomerHistory = () => {
  const { orders, isLoading, error, accountData, serviceData } = useCustomerOrders();

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

  const handleViewDetails = (orderId) => {
    alert(`Xem chi tiết đơn hàng ID: ${orderId}`);
  };

  if (isLoading) return <div className="orders-loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="orders-error text-red-500">{error}</div>;

  return (
    <div className="customer-orders-container">
      <h2 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h2>
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
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{serviceData[order.serviceId]?.serviceName || 'N/A'}</td>
                <td>{serviceData[order.serviceId]?.servicePurpose || 'N/A'}</td>
                <td>{order.resultDeliverAddress || 'N/A'}</td>
                <td>
                  <span className="pill">{order.sampleType === 'center' ? 'Tại trung tâm' : 'Tự lấy mẫu'}</span>
                </td>
                <td>{serviceData[order.serviceId]?.timeTest || 'N/A'} ngày</td>
                <td>{formatDate(order.orderDate)}</td>
                <td>{formatPrice(order.amount)}</td>
                <td className={`status ${getStatusClass(order.orderStatus)}`}>
                  {order.orderStatus === 'PENDING'
                    ? 'Đặt lịch/Đăng ký'
                    : order.orderStatus === 'PREPARING'
                    ? 'Chuẩn bị lấy mẫu'
                    : order.orderStatus === 'COLLECTING'
                    ? 'Thu thập mẫu'
                    : order.orderStatus === 'TRANSFERRING'
                    ? 'Chuyển mẫu'
                    : order.orderStatus === 'TESTING'
                    ? 'Xét nghiệm'
                    : order.orderStatus === 'COMPLETED'
                    ? 'Hoàn thành'
                    : 'N/A'}
                </td>
                <td>
                  <button className="action-btn" onClick={() => handleViewDetails(order.orderId)}>
                    Chi tiết đơn
                  </button>
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