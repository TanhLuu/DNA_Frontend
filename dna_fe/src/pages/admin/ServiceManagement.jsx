import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';
import axios from 'axios';
import '../../styles/admin/serviceManagement.css';

// === API SETUP ===
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const getAllServices = async () => {
  const res = await axiosInstance.get('/api/services');
  return res.data;
};
const createService = async (data) => {
  const res = await axiosInstance.post('/api/services', data);
  return res.data;
};
const updateService = async (id, data) => {
  const res = await axiosInstance.put(`/api/services/${id}`, data);
  return res.data;
};
const deleteService = async (id) => {
  const res = await axiosInstance.delete(`/api/services/${id}`);
  return res.data;
};

// === MAIN COMPONENT ===
const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    serviceID: null,
    serviceName: '',
    servicePurpose: '',
    timeTest: 0,
    serviceBlog: '',
    price: 0,
    numberOfSample: 1
  });
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
      serviceID: null,
      serviceName: '',
      servicePurpose: '',
      timeTest: 0,
      serviceBlog: '',
      price: 0,
      numberOfSample: 1
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (service) => {
    setFormData({ ...service });
    setIsFormModalOpen(true);
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


  const handleSubmit = async () => {
    try {
      const payload = { ...formData };

      if (formData.serviceID) {
        await updateService(formData.serviceID, payload);
      } else {
        await createService(payload);
      }

      await fetchServices();
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Lỗi khi lưu dịch vụ:', error);
      alert('Có lỗi xảy ra khi lưu dịch vụ');
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

      {/* Form Popup */}
      <Dialog open={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{formData.serviceID ? 'Chỉnh sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="serviceName"
            label="Tên Dịch Vụ"
            type="text"
            fullWidth
            value={formData.serviceName}
            onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
          />
          <TextField
            margin="dense"
            name="servicePurpose"
            label="Loại Dịch Vụ"
            type="text"
            fullWidth
            value={formData.servicePurpose}
            onChange={(e) => setFormData({ ...formData, servicePurpose: e.target.value })}
          />
          <TextField
            margin="dense"
            name="timeTest"
            label="Thời Gian Xét Nghiệm (ngày)"
            type="number"
            fullWidth
            value={formData.timeTest}
            onChange={(e) => setFormData({ ...formData, timeTest: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            name="price"
            label="Giá (VND)"
            type="number"
            fullWidth
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            name="numberOfSample"
            label="Số Mẫu"
            type="number"
            fullWidth
            value={formData.numberOfSample}
            onChange={(e) => setFormData({ ...formData, numberOfSample: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            name="serviceBlog"
            label="Mô tả (Không bắt buộc)"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={formData.serviceBlog}
            onChange={(e) => setFormData({ ...formData, serviceBlog: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFormModalOpen(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {formData.serviceID ? 'Cập Nhật' : 'Thêm Mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServiceManagement;
