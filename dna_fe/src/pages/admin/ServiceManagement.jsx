import React, { useState, useEffect } from 'react';
import ServiceFormModalManager from '../../components/Admin/ServiceFormModalManager';
import ConfirmDeleteServiceModal from '../../components/Admin/ConfirmDeleteServiceModal';
import {
  getAllServices,
  createService,
  updateService,
  deleteService
} from '../../api/serviceApi';
import '../../styles/admin/serviceManagement.css';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    type: '',
    testDuration: '',
    price: '',
    description: ''
  });
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
    setFormData({
      id: null,
      name: '',
      type: '',
      testDuration: '',
      price: '',
      description: ''
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (service) => {
    setFormData({
      id: service.id,
      name: service.name,
      type: service.type,
      testDuration: service.testDuration,
      price: service.price,
      description: service.description
    });
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        testDuration: Number(formData.testDuration),
        price: Number(formData.price),
        description: formData.description
      };

      if (formData.id) {
        await updateService(formData.id, payload);
      } else {
        await createService(payload);
      }

      await fetchServices();
      setIsFormModalOpen(false);
    } catch (err) {
      console.error('Lỗi khi lưu dịch vụ:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      await fetchServices();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Lỗi khi xóa dịch vụ:', err);
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchKeyword.toLowerCase())
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
                  <tr key={service.id}>
                    <td>{service.name}</td>
                    <td>{service.type}</td>
                    <td>{service.testDuration}</td>
                    <td>{Number(service.price).toLocaleString('vi-VN')}</td>
                    <td>
                      <button className="edit-btn" onClick={() => openEditModal(service)}>Sửa</button>
                      <button className="delete-btn" onClick={() => openDeleteModal(service)}>Xóa</button>
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

      {/* Popup Tạo / Sửa */}
      <ServiceFormModalManager
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Popup Xác nhận Xóa */}
      <ConfirmDeleteServiceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        service={selectedService}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ServiceManagement;
