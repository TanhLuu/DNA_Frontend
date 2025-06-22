import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccountByCustomerId, getServiceById } from '../api/accountApi';

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [accountData, setAccountData] = useState({});
  const [serviceData, setServiceData] = useState({});

  useEffect(() => {
    const fetchOrdersAndData = async () => {
      try {
        setIsLoading(true);
        const { data: ordersData } = await axios.get('http://localhost:8080/api/testorders', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(ordersData);

        const accountPromises = ordersData.map(order =>
          getAccountByCustomerId(order.customerId)
            .then(account => ({
              customerId: order.customerId,
              fullName: account.fullName || 'N/A',
              phone: account.phone || 'N/A',
              email: account.email || 'N/A',
            }))
            .catch(() => ({
              customerId: order.customerId,
              fullName: 'N/A',
              phone: 'N/A',
              email: 'N/A',
            }))
        );
        const accounts = await Promise.all(accountPromises);
        setAccountData(accounts.reduce((acc, a) => ({ ...acc, [a.customerId]: a }), {}));

        const servicePromises = ordersData.map(order =>
          order.serviceId
            ? getServiceById(order.serviceId)
              .then(service => ({
                serviceId: order.serviceId,
                serviceName: service.serviceName || 'N/A',
                serviceType: service.serviceType || 'N/A',
                timeTest: service.timeTest || 'N/A',
              }))
              .catch(() => ({
                serviceId: order.serviceId,
                serviceName: 'N/A',
                serviceType: 'N/A',
                timeTest: 'N/A',
              }))
            : Promise.resolve({
              serviceId: order.serviceId,
              serviceName: 'N/A',
              serviceType: 'N/A',
              timeTest: 'N/A',
            })
        );
        const services = await Promise.all(servicePromises);
        setServiceData(services.reduce((acc, s) => ({ ...acc, [s.serviceId]: s }), {}));

        setFilteredOrders(ordersData);
      } catch (err) {
        setError('Không thể tải danh sách đơn hàng: ' + (err.response?.data?.message || err.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrdersAndData();
  }, []);

  useEffect(() => {
    setFilteredOrders(filter === 'ALL' ? orders : orders.filter(o => o.orderStatus === filter));
  }, [filter, orders]);

  const handleFilterChange = status => setFilter(status);

  return { orders, setOrders, filteredOrders, isLoading, error, handleFilterChange, accountData, serviceData };
};

export default useOrders;