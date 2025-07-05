// src/components/admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { fetchDashboardData } from '../../api/dashboardApi';
import STATUS_LABELS from '../../constants/orderStatusLabels';
import '../../styles/admin/Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orderStatusData, setOrderStatusData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [services, setServices] = useState({});
  const [accountData, setAccountData] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardData(filterMonth);
        setServices(data.services);
        setAccountData(data.accountData);
        setTotalOrders(data.totalOrders);
        setCompletedOrders(data.completedOrders);
        setTotalRevenue(data.totalRevenue);
        setOrderStatusData(data.orderStatusData);
        setRevenueData(data.revenueData);
        setRecentOrders(data.recentOrders);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterMonth]);

  // Hàm xuất file Excel
  const exportToExcel = () => {
    // Chuẩn bị dữ liệu cho Excel
    const data = recentOrders.map(order => ({
      'Mã đơn': order.orderId,
      'Khách hàng': order.account?.fullName || 'Không có',
      'Ngày đặt': order.orderDate,
      'Trạng thái': STATUS_LABELS[order.orderStatus] || 'Không có',
      'Loại dịch vụ': services[order.serviceId]?.serviceType || 'Không có',
      'Tên dịch vụ': services[order.serviceId]?.serviceName || 'Không có',
      'Số tiền': Number(order.amount), // Chuyển thành số để định dạng
    }));

    // Tạo worksheet mới
    const ws = XLSX.utils.book_new();

    // Thêm tiêu đề báo cáo
    const title = [['BÁO CÁO ĐƠN HÀNG GẦN ĐÂY']];
    XLSX.utils.sheet_add_aoa(ws, title, { origin: 'A1' });

    // Thêm dữ liệu với tiêu đề cột
    XLSX.utils.sheet_add_json(ws, data, {
      origin: 'A3', // Bắt đầu từ hàng 3 để chừa chỗ cho tiêu đề
      header: ['Mã đơn', 'Khách hàng', 'Ngày đặt', 'Trạng thái', 'Loại dịch vụ', 'Tên dịch vụ', 'Số tiền'],
      skipHeader: false,
    });

    // Định dạng tiêu đề báo cáo
    ws['A1'].s = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }]; // Gộp ô A1:G1 cho tiêu đề

    // Định dạng tiêu đề cột
    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: 'FFFFAA00' } }, // Màu vàng nhạt
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    // Áp dụng style cho hàng tiêu đề cột (hàng 3)
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: C }); // Hàng 3 (index 2)
      if (ws[cellAddress]) {
        ws[cellAddress].s = headerStyle;
      }
    }

    // Định dạng các ô dữ liệu
    for (let R = 3; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellAddress]) continue;

        // Định dạng cột "Số tiền"
        if (C === 6) { // Cột "Số tiền" (index 6)
          ws[cellAddress].z = '#,##0 "VND"'; // Định dạng tiền tệ
          ws[cellAddress].v = Number(ws[cellAddress].v); // Đảm bảo giá trị là số
        }

        // Căn chỉnh và thêm viền
        ws[cellAddress].s = {
          alignment: { horizontal: C < 6 ? 'left' : 'right', vertical: 'center' },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
          },
        };
      }
    }

    // Đặt độ rộng cột
    ws['!cols'] = [
      { wch: 10 }, // Mã đơn
      { wch: 20 }, // Khách hàng
      { wch: 15 }, // Ngày đặt
      { wch: 15 }, // Trạng thái
      { wch: 15 }, // Loại dịch vụ
      { wch: 25 }, // Tên dịch vụ
      { wch: 15 }, // Số tiền
    ];

    // Tạo workbook và lưu file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Orders_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="filter-container">
        <label>Lọc theo tháng:</label>
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        />
      </div>

      <div className="summary-grid">
        <div className="summary-box total-orders">
          <h2>Tổng số đơn</h2>
          <p>{totalOrders}</p>
        </div>
        <div className="summary-box completed-orders">
          <h2>Đơn đã hoàn tất</h2>
          <p>{completedOrders}</p>
        </div>
        <div className="summary-box total-revenue">
          <h2>Tổng doanh thu</h2>
          <p>{totalRevenue.toLocaleString()} VND</p>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-container">
          <h2>Tình trạng đơn hàng</h2>
          {orderStatusData ? <Pie data={orderStatusData} options={{ responsive: true }} /> : <p>Không có dữ liệu</p>}
        </div>
        <div className="chart-container">
          <h2>Doanh thu theo tháng</h2>
          {revenueData ? <Bar data={revenueData} options={{ responsive: true }} /> : <p>Không có dữ liệu</p>}
        </div>
      </div>

      <div className="recent-orders">
        <div className="header">
          <h2>Đơn hàng gần đây</h2>
          <button onClick={exportToExcel}>Xuất Excel</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Loại dịch vụ</th>
              <th>Tên dịch vụ</th>
              <th>Số tiền</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.account?.fullName || 'Không có'}</td>
                <td>{order.orderDate}</td>
                <td>{STATUS_LABELS[order.orderStatus] || 'Không có'}</td>
                <td>{services[order.serviceId]?.serviceType || 'Không có'}</td>
                <td>{services[order.serviceId]?.serviceName || 'Không có'}</td>
                <td>{order.amount.toLocaleString()} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;