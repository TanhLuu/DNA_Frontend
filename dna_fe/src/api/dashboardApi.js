// src/api/dashboardApi.js
import axiosInstance from './axiosInstance';
import { getAccountByCustomerId } from './customerOrderApi';

export const fetchDashboardData = async (filterMonth = '') => {
  try {
    // Lấy dữ liệu dịch vụ
    const servicesResponse = await axiosInstance.get('/api/services');
    const serviceMap = servicesResponse.data.reduce((acc, service) => {
      acc[service.serviceID] = service;
      return acc;
    }, {});

    // Lấy dữ liệu đơn hàng
    const ordersResponse = await axiosInstance.get('/api/testorders');
    let orders = ordersResponse.data || [];

    // Lấy thông tin tài khoản
    const accountPromises = orders.map(order =>
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
    const accountData = accounts.reduce((acc, a) => ({ ...acc, [a.customerId]: a }), {});

    // Lọc theo tháng nếu có
    if (filterMonth) {
      orders = orders.filter(order => order.orderDate?.startsWith(filterMonth));
    }

    // Tính toán dữ liệu cho dashboard
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.orderStatus === 'COMPLETED').length;
    const totalRevenue = orders
      .filter(order => order.orderStatus === 'COMPLETED')
      .reduce((sum, order) => sum + (order.amount || 0), 0);

    // Dữ liệu cho biểu đồ tình trạng đơn hàng
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {});
    const orderStatusData = {
      labels: Object.keys(statusCounts).length > 0 ? Object.keys(statusCounts) : ['Không có dữ liệu'],
      datasets: [{
        data: Object.values(statusCounts).length > 0 ? Object.values(statusCounts) : [1],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }],
    };

    // Dữ liệu cho biểu đồ doanh thu theo tháng
    const monthlyRevenue = orders
      .filter(order => order.orderStatus === 'COMPLETED')
      .reduce((acc, order) => {
        const month = order.orderDate?.slice(0, 7) || 'Unknown';
        acc[month] = (acc[month] || 0) + (order.amount || 0);
        return acc;
      }, {});
    const revenueData = {
      labels: Object.keys(monthlyRevenue).length > 0 ? Object.keys(monthlyRevenue) : ['Không có dữ liệu'],
      datasets: [{
        label: 'Doanh thu (VND)',
        data: Object.values(monthlyRevenue).length > 0 ? Object.values(monthlyRevenue) : [0],
        backgroundColor: '#36A2EB',
      }],
    };

    // Lấy đơn hàng gần đây
    const recentOrders = orders
      .map(order => ({
        ...order,
        account: accountData[order.customerId] || { fullName: 'N/A' },
      }))
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, 10);

    return {
      services: serviceMap,
      accountData,
      totalOrders,
      completedOrders,
      totalRevenue,
      orderStatusData,
      revenueData,
      recentOrders,
    };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu dashboard:', error);
    throw error;
  }
};