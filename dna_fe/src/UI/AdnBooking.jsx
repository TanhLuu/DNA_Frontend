import React from 'react';
import '../../styles/components/shared/AdnBooking.css';
import { Link } from 'react-router-dom';

const AdnBooking = () => {
  return (
    <div className="adn-booking">
      <div className="adn-card">
        <h3>Xét nghiệm ADN Dân sự</h3>
        <ul>
          <li>✔ Dành cho mục đích cá nhân</li>
          <li>✔ Không yêu cầu giấy tờ pháp lý</li>
          <li>✔ Thông tin được bảo mật</li>
        </ul>
        <Link to="/requestFormCivil">
          <button>Đặt lịch</button>
        </Link>
      </div>
      <div className="adn-card">
        <h3>Xét nghiệm ADN Hành chính</h3>
        <ul>
          <li>✔ Dùng trong các thủ tục pháp lý</li>
          <li>✔ Yêu cầu CMND/Khai sinh</li>
          <li>✔ Có giá trị pháp lý</li>
        </ul>
        <Link to="/requesFormtLegal">
          <button>Đặt lịch</button>
        </Link>
      </div>
    </div>
  );
};

export default AdnBooking;
