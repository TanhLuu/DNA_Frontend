import { useState, useEffect } from 'react';
import {getAccountByCustomerId, getOrdersByCustomerId , getServiceById } from '../../api/customerOrderApi';

const useCustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accountData, setAccountData] = useState({});
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    const fetchOrdersAndData = async () => {
      try {
        setIsLoading(true);
        const customerId = localStorage.getItem('customerId');
        if (!customerId) throw new Error('Không tìm thấy thông tin khách hàng.');

        const res = await getOrdersByCustomerId(customerId);
        const ordersData = res;
        setOrders(ordersData);

        const account = await getAccountByCustomerId(customerId); // account đã là data
        setAccountData({
          fullName: account.fullName || 'Không có',
          phone: account.phone || 'Không có',
          email: account.email || 'Không có',
        });

        const servicePromises = ordersData.map(async (order) => {
          try {
            const service = await getServiceById(order.serviceId); 
            return {
              serviceId: order.serviceId,
              serviceName: service.serviceName || 'Không có',
              serviceType: service.serviceType || 'Không có',
              timeTest: service.timeTest || 'Không có',
            };
          } catch {
            return {
              serviceId: order.serviceId,
              serviceName: 'Không có',
              serviceType: 'Không có',
              timeTest: 'Không có',
            };
          }
        });
        const services = await Promise.all(servicePromises);
        const serviceMap = services.reduce((acc, s) => ({ ...acc, [s.serviceId]: s }), {});
        setServiceData(serviceMap);
        setFilteredOrders(ordersData);
      } catch (err) {
        setError('Không thể tải dữ liệu: ' + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrdersAndData();
  }, []);

  useEffect(() => {
    setFilteredOrders(filter === 'ALL' ? orders : orders.filter(o => o.orderStatus === filter));
  }, [filter, orders]);

  const handleFilterChange = (status) => setFilter(status);

  return {
    orders,
    filteredOrders,
    isLoading,
    error,
    accountData,
    serviceData,
    handleFilterChange,
  };
};

export default useCustomerOrders;
