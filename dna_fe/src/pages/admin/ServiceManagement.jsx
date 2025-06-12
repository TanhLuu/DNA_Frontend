import React, { useEffect, useState } from 'react';
import '../../styles/admin/serviceManagement.css';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/services'); // <-- chỉnh lại URL theo backend bạn
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="service-container">
      <div className="service-card">
        <div className="service-header">
          <h3>Quản lý Dịch vụ</h3>
          <button className="add-button">+ Thêm Dịch vụ</button>
        </div>

        <div className="search-bar">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Nhập từ khóa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className="service-table">
            <thead>
              <tr>
                <th>Tên dịch vụ</th>
                <th>Loại</th>
                <th>Giá (VND)</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length > 0 ? (
                filteredServices.map(service => (
                  <tr key={service.id}>
                    <td>{service.name}</td>
                    <td>{service.type}</td>
                    <td>{Number(service.price).toLocaleString('vi-VN')}</td>
                    <td>
                      <button className="edit-btn">Sửa</button>
                      <button className="delete-btn">Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    Không tìm thấy dịch vụ nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;
