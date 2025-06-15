import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material';

const ServiceFormPopup = ({ open, onClose, serviceToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    serviceName: '',
    servicePurpose: '',
    timeTest: 0,
    serviceBlog: '',
    price: 0,
    numberOfSample: 0
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        serviceName: serviceToEdit.serviceName,
        servicePurpose: serviceToEdit.servicePurpose,
        timeTest: serviceToEdit.timeTest,
        serviceBlog: serviceToEdit.serviceBlog || '',
        price: serviceToEdit.price,
        numberOfSample: serviceToEdit.numberOfSample
      });
    } else {
      setFormData({
        serviceName: '',
        servicePurpose: '',
        timeTest: 0,
        serviceBlog: '',
        price: 0,
        numberOfSample: 0
      });
    }
  }, [serviceToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.serviceName.trim()) newErrors.serviceName = 'Tên dịch vụ là bắt buộc';
    if (!formData.servicePurpose.trim()) newErrors.servicePurpose = 'Loại dịch vụ là bắt buộc';
    if (formData.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
    if (formData.timeTest <= 0) newErrors.timeTest = 'Thời gian xét nghiệm phải lớn hơn 0';
    if (formData.numberOfSample <= 0) newErrors.numberOfSample = 'Số mẫu phải lớn hơn 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (serviceToEdit) {
        await axiosInstance.put(`/api/services/${serviceToEdit.serviceID}`, formData);
      } else {
        await axiosInstance.post('/api/services', formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu dịch vụ:', error);
      alert('Có lỗi xảy ra khi lưu dịch vụ');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{serviceToEdit ? 'Chỉnh sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="dense"
            name="serviceName"
            label="Tên Dịch Vụ"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.serviceName}
            onChange={handleChange}
            error={!!errors.serviceName}
            helperText={errors.serviceName}
            required
          />
          
          <TextField
            margin="dense"
            name="servicePurpose"
            label="Loại Dịch Vụ"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.servicePurpose}
            onChange={handleChange}
            error={!!errors.servicePurpose}
            helperText={errors.servicePurpose}
            required
          />
          
          <TextField
            margin="dense"
            name="price"
            label="Giá Dịch Vụ (VND)"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            required
            InputProps={{ inputProps: { min: 0 } }}
          />
          
          <TextField
            margin="dense"
            name="timeTest"
            label="Thời Gian Xét Nghiệm (ngày)"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.timeTest}
            onChange={handleChange}
            error={!!errors.timeTest}
            helperText={errors.timeTest}
            required
            InputProps={{ inputProps: { min: 1 } }}
          />
          
          <TextField
            margin="dense"
            name="numberOfSample"
            label="Số Mẫu"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.numberOfSample}
            onChange={handleChange}
            error={!!errors.numberOfSample}
            helperText={errors.numberOfSample}
            required
            InputProps={{ inputProps: { min: 1 } }}
          />
          
          
          <TextField
            margin="dense"
            name="serviceBlog"
            label="Mô Tả Dịch Vụ (Không bắt buộc)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.serviceBlog}
            onChange={handleChange}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {serviceToEdit ? 'Cập Nhật' : 'Thêm Mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceFormPopup; 