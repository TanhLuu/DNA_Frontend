import React, { useState, useEffect } from 'react';
import ServiceFormPopup from './ServiceFormPopup';
import { getAllServices, deleteService } from '../../api/serviceApi';
import '../../styles/admin/serviceManagement.css';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách dịch vụ:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setSelectedService(null);
    setFormOpen(true);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?');
    if (!confirmed) return;

    try {
      await deleteService(id);
      await fetchServices();
    } catch (err) {
      console.error('Lỗi khi xóa dịch vụ:', err);
      alert('Đã xảy ra lỗi khi xóa dịch vụ.');
    }
  };

  const filteredServices = services.filter(service =>
    service.serviceName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="service-container">
      <div className="service-card">
        <div className="service-header">
          <span>Quản lý dịch vụ</span>
          <button className="add-button" onClick={openAddModal}>+ Thêm dịch vụ</button>
        </div>

        <div className="search-bar">
          🔍
          <input
            type="text"
            placeholder="Tìm kiếm theo tên dịch vụ"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className="service-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Loại</th>
                <th>Thời gian (ngày)</th>
                <th>Giá (VND)</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length > 0 ? (
                filteredServices.map(service => (
                  <tr key={service.serviceID}>
                    <td>{service.serviceName}</td>
                    <td>{service.servicePurpose}</td>
                    <td>{service.timeTest}</td>
                    <td>{Number(service.price).toLocaleString('vi-VN')}</td>
                    <td>
                      <button className="edit-btn" onClick={() => openEditModal(service)}>Sửa</button>
                      <button className="delete-btn" onClick={() => handleDelete(service.serviceID)}>Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    Không tìm thấy dịch vụ nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ServiceFormPopup
        open={formOpen}
        onClose={() => setFormOpen(false)}
        serviceToEdit={selectedService}
        onSuccess={fetchServices}
      />
    </div>
  );
};

export default ServiceManagement;
