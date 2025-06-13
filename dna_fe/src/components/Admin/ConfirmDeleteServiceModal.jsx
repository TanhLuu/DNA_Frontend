import React from 'react';
import '../../styles/components/UI/confirmDeleteServiceModal.css';

const ConfirmDeleteServiceModal = ({ isOpen, service, onClose, onDelete }) => {
  if (!isOpen || !service) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box delete-box">
        <h3 className="modal-title delete-title">Xác nhận xóa dịch vụ</h3>
        <p>Bạn có chắc chắn muốn xóa dịch vụ sau không? Hành động này không thể hoàn tác.</p>

        <div className="service-info">
          <p><strong>Mã dịch vụ:</strong> {service.code || 'Không có mã'}</p>
          <p><strong>Tên dịch vụ:</strong> {service.name}</p>
          <p><strong>Giá:</strong> {Number(service.price).toLocaleString('vi-VN')} ₫</p>
          <p><strong>Loại dịch vụ:</strong> {service.type}</p>
        </div>

        <div className="modal-actions">
          <button className="btn-delete" onClick={() => onDelete(service.id)}>Xóa</button>
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteServiceModal;
