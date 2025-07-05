import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { createService, updateService } from '../../../api/serviceApi';

const ServiceFormPopup = ({ open, onClose, serviceToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceType: '',
    timeTest: '',
    describe: '',
    price: '',
    numberOfSamples: 2, // Mặc định là 2
    pricePerAdditionalSample: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        serviceName: serviceToEdit.serviceName || '',
        serviceType: serviceToEdit.serviceType || '',
        timeTest: serviceToEdit.timeTest || '',
        describe: serviceToEdit.describe || '',
        price: serviceToEdit.price || '',
        numberOfSamples: serviceToEdit.numberOfSamples || 2,
        pricePerAdditionalSample: serviceToEdit.pricePerAdditionalSample || ''
      });
    } else {
      setFormData({
        serviceName: '',
        serviceType: '',
        timeTest: '',
        describe: '',
        price: '',
        numberOfSamples: 2,
        pricePerAdditionalSample: ''
      });
    }
  }, [serviceToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'timeTest' || name === 'numberOfSamples' || name === 'pricePerAdditionalSample'
        ? (value === '' ? '' : Number(value))
        : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.serviceName.trim()) newErrors.serviceName = 'Tên dịch vụ là bắt buộc';
    if (!formData.serviceType.trim()) newErrors.serviceType = 'Loại dịch vụ là bắt buộc';
    if (formData.price === '' || formData.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
    if (formData.timeTest === '' || formData.timeTest <= 0) newErrors.timeTest = 'Thời gian xét nghiệm phải lớn hơn 0';
    if (formData.numberOfSamples === '' || formData.numberOfSamples < 0) newErrors.numberOfSamples = 'Số mẫu phải không âm';
    if (formData.pricePerAdditionalSample !== '' && formData.pricePerAdditionalSample < 0) {
      newErrors.pricePerAdditionalSample = 'Giá tăng thêm mỗi tùy chọn phải không âm';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const dataToSubmit = {
        ...formData,
        pricePerAdditionalSample: formData.pricePerAdditionalSample === '' ? null : formData.pricePerAdditionalSample
      };

      if (serviceToEdit) {
        await updateService(serviceToEdit.serviceID, dataToSubmit);
      } else {
        await createService(dataToSubmit);
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
        <TextField
          margin="dense"
          name="serviceName"
          label="Tên Dịch Vụ"
          fullWidth
          value={formData.serviceName}
          onChange={handleChange}
          error={!!errors.serviceName}
          helperText={errors.serviceName}
        />

        <FormControl fullWidth margin="dense" error={!!errors.serviceType}>
          <InputLabel id="serviceType-label">Loại Dịch Vụ</InputLabel>
          <Select
            labelId="serviceType-label"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            label="Loại Dịch Vụ"
          >
            <MenuItem value="Dân sự">Dân sự</MenuItem>
            <MenuItem value="Hành chính">Hành chính</MenuItem>
          </Select>
        </FormControl>
        {errors.serviceType && (
          <span style={{ color: 'red', fontSize: 12 }}>{errors.serviceType}</span>
        )}

        <TextField
          margin="dense"
          name="timeTest"
          label="Th Thời Gian Xét Nghiệm (ngày)"
          type="number"
          fullWidth
          value={formData.timeTest}
          onChange={handleChange}
          error={!!errors.timeTest}
          helperText={errors.timeTest}
        />
        <TextField
          margin="dense"
          name="price"
          label="Giá (VND)"
          type="number"
          fullWidth
          value={formData.price}
          onChange={handleChange}
          error={!!errors.price}
          helperText={errors.price}
        />
        <TextField
          margin="dense"
          name="numberOfSamples"
          label="Số Mẫu Mặc Định"
          type="number"
          fullWidth
          value={formData.numberOfSamples}
          onChange={handleChange}
          error={!!errors.numberOfSamples}
          helperText={errors.numberOfSamples || 'Mặc định là 2'}
        />
        <TextField
          margin="dense"
          name="pricePerAdditionalSample"
          label="Giá Tăng Thêm Mỗi Mẫu (VND, Không bắt buộc)"
          type="number"
          fullWidth
          value={formData.pricePerAdditionalSample}
          onChange={handleChange}
 stress={!!errors.pricePerAdditionalSample}
          helperText={errors.pricePerAdditionalSample}
        />
        <TextField
          margin="dense"
          name="describe"
          label="Mô tả (Không bắt buộc)"
          fullWidth
          multiline
          rows={3}
          value={formData.describe}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Hủy</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {serviceToEdit ? 'Cập Nhật' : 'Thêm Mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceFormPopup;