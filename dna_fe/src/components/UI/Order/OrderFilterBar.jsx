import React from 'react';

const statusButtons = [
  { key: 'PENDING', label: 'Đặt lịch/Đăng ký', className: 'btn-red' },
  { key: 'PREPARING', label: 'Chuẩn bị lấy mẫu', className: 'btn-gray' },
  { key: 'COLLECTING', label: 'Thu thập mẫu', className: 'btn-yellow' },
  { key: 'TRANSFERRING', label: 'Chuyển mẫu', className: 'btn-light-blue' },
  { key: 'TESTING', label: 'Xét nghiệm', className: 'btn-blue' },
  { key: 'COMPLETED', label: 'Hoàn thành', className: 'btn-green' },
  { key: 'ALL', label: 'Tất cả', className: 'btn-dark-blue' },
];

const OrderFilterBar = ({ handleFilterChange }) => (
  <div className="orders-buttons">
    {statusButtons.map(btn => (
      <button
        key={btn.key}
        className={`btn ${btn.className}`}
        onClick={() => handleFilterChange(btn.key)}
      >
        {btn.label}
      </button>
    ))}
  </div>
);

export default OrderFilterBar;
