import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography
} from '@mui/material';

const ServiceDetailDialog = ({ open, onClose, service }) => {
  if (!service) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết dịch vụ</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1"><strong>Tên dịch vụ:</strong> {service.serviceName}</Typography>
        <Typography variant="subtitle1"><strong>Loại dịch vụ:</strong> {service.serviceType}</Typography>
        <Typography variant="subtitle1"><strong>Thời gian xét nghiệm:</strong> {service.timeTest} ngày</Typography>
        <Typography variant="subtitle1">
          <strong>Giá:</strong> {Number(service.price).toLocaleString('vi-VN')} VND
        </Typography>
        <Typography variant="subtitle1"><strong>Mô tả:</strong></Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {service.serviceBlog || 'Không có mô tả'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceDetailDialog;
