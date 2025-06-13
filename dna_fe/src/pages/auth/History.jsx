import React from 'react';
import '../../styles/auth/History.css';

const History = () => {
  // Mock data - thay thế bằng API call thực tế sau
  const customerInfo = {
    fullName: 'Nguyễn Văn A',
    birthDate: '01/01/1990',
    gender: 'Nam',
    phone: '0901234567',
    address: '123 Đường ABC, TPHCM',
    email: 'nguyenvana@gmail.com'
  };

  const historyData = [
    {
      id: 1,
      testCode: 'XN-0002',
      date: '10/10/2022',
      type: 'Hành chính',
      purpose: 'Giám định huyết đông',
      status: 'Chuẩn bị lấy mẫu'
    },
    {
      id: 2,
      testCode: 'XN-0002',
      date: '10/10/2022',
      type: 'Hành chính',
      purpose: 'Giám định huyết đông',
      status: 'Hoàn thành'
    },
    {
      id: 3,
      testCode: 'XN-0002',
      date: '10/10/2022',
      type: 'Hành chính',
      purpose: 'Giám định huyết đông',
      status: 'Xét nghiệm'
    }
  ];

  return (
    <div className="history-container">
      <div className="customer-info">
        <h2>Thông tin khách hàng</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Họ và tên:</label>
            <span>{customerInfo.fullName}</span>
          </div>
          <div className="info-item">
            <label>Ngày sinh:</label>
            <span>{customerInfo.birthDate}</span>
          </div>
          <div className="info-item">
            <label>Giới tính:</label>
            <span>{customerInfo.gender}</span>
          </div>
          <div className="info-item">
            <label>Số điện thoại:</label>
            <span>{customerInfo.phone}</span>
          </div>
          <div className="info-item">
            <label>Địa chỉ:</label>
            <span>{customerInfo.address}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{customerInfo.email}</span>
          </div>
        </div>
      </div>

      <div className="history-section">
        <h2>Lịch sử xét nghiệm</h2>
        <table className="history-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã xét nghiệm</th>
              <th>Ngày</th>
              <th>Loại</th>
              <th>Mục đích</th>
              <th>Trạng thái</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.testCode}</td>
                <td>{item.date}</td>
                <td>{item.type}</td>
                <td>{item.purpose}</td>
                <td>{item.status}</td>
                <td>
                  <button className="detail-btn">Xem</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;