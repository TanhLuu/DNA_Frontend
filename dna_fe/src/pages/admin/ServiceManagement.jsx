import React, { useState, useEffect } from 'react';
import ServiceFormPopup from '../../components/UI/Service/ServiceFormPopup';
import ServiceDetailDialog from '../../components/UI/Service/ServiceDetailDialog'; // Đã sửa đúng đường dẫn
import { getAllServices, deleteService } from '../../api/serviceApi';
import '../../styles/admin/serviceManagement.css';
import { Tooltip } from '@mui/material';


const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [viewingService, setViewingService] = useState(null); // 💡 để mở dialog chi tiết

  useEffect(() => {
    fetchServices();
    const role = localStorage.getItem('role');
    setUserRole(role || '');
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

  const handleViewDetail = (service) => {
    setViewingService(service); // 💡 mở popup dialog
  };

  const filteredServices = services.filter(service =>
    service.serviceName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="service-container">
      <div className="service-card">
        <div className="service-header">
          <span>Quản lý dịch vụ</span>
          {userRole === 'MANAGER' && (
            <button className="service-btn-add" onClick={openAddModal}>+ Thêm dịch vụ</button>
          )}
        </div>

        <div className="service-search-bar">
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
                    <td>{service.serviceType}</td>
                    <td>{service.timeTest}</td>
                    <td>{Number(service.price).toLocaleString('vi-VN')}</td>
                    <td>
                      <Tooltip title="Xem chi tiết dịch vụ">
                        <button
                          className="service-btn service-detail-btn"
                          onClick={() => handleViewDetail(service)}
                        >
                          Chi tiết
                        </button>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa dịch vụ">
                        <button
                          className="service-btn service-edit-btn"
                          onClick={() => openEditModal(service)}
                          disabled={userRole !== 'MANAGER'}
                        >
                          Sửa
                        </button>
                      </Tooltip>
                      <Tooltip title="Xóa dịch vụ">
                        <button
                          className="service-btn service-delete-btn"
                          onClick={() => handleDelete(service.serviceID)}
                          disabled={userRole !== 'MANAGER'}
                        >
                          Xóa
                        </button>
                      </Tooltip>
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

      {/* 💡 Popup chi tiết */}
      <ServiceDetailDialog
        open={!!viewingService}
        onClose={() => setViewingService(null)}
        service={viewingService}
      />
    </div>
  );
};

export default ServiceManagement;
