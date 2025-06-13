import React from 'react';
import '../../styles/components/UI/serviceFormModalManager.css';

const ServiceFormModalManager = ({ isOpen, onClose, onSave, formData, setFormData }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 className="modal-title">Tạo / Sửa Dịch vụ</h3>

        <label>Tên dịch vụ:</label>
        <input
          type="text"
          name="name"
          placeholder="VD: Xét nghiệm ADN Mẹ Con"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Loại dịch vụ:</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="">-- Chọn loại dịch vụ --</option>
          <option value="Dân sự">Dân sự</option>
          <option value="Hành chính">Hành chính</option>
        </select>

        <label>Thời gian xét nghiệm (ngày):</label>
        <input
          type="number"
          name="testDuration"
          placeholder="VD: 3"
          min="1"
          value={formData.testDuration || ''}
          onChange={handleChange}
        />


        <label>Giá dịch vụ (VND):</label>
        <input
          type="number"
          name="price"
          placeholder="VD: 4500000"
          value={formData.price}
          onChange={handleChange}
        />

        <label>Mô tả chi tiết:</label>
        <textarea
          name="description"
          placeholder="Nhập mô tả dịch vụ"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button className="btn-save" onClick={onSave}>Lưu</button>
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceFormModalManager;
