import { useState, useEffect } from 'react';
import axios from 'axios';
import { getServiceById } from '../../api/customerOrderApi';
import { getAccountByCustomerId } from '../../api/customerOrderApi';

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
              fullName: account.fullName || 'Không có',
              phone: account.phone || 'Không có',
              email: account.email || 'Không có',
            }))
            .catch(() => ({
              customerId: order.customerId,
              fullName: 'Không có',
              phone: 'Không có',
              email: 'Không có',
            }))
        );
        const accounts = await Promise.all(accountPromises);
        setAccountData(accounts.reduce((acc, a) => ({ ...acc, [a.customerId]: a }), {}));

        const safeGetService = async (order) => {
          try {
            if (!order.serviceId) throw new Error();
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
        };

        const servicePromises = ordersData.map(safeGetService);

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