import React from 'react';
import '../../styles/components/shared/AdnBooking.css';
import { Link } from 'react-router-dom';

const AdnBooking = () => {
  return (
    <div className="adn-booking-container">
      <h2 className="adn-booking-title">LỰA CHỌN LOẠI XÉT NGHIỆM ADN PHÙ HỢP</h2>
      <p className="adn-booking-subtitle">
        Vui lòng chọn loại xét nghiệm phù hợp với nhu cầu của bạn. Chúng tôi cam kết bảo mật thông tin và đảm bảo kết quả chính xác tuyệt đối.
      </p>
      <div className="adn-booking">
        <div className="adn-card">
          <h3>XÉT NGHIỆM ADN DÂN SỰ</h3>
          <p className="adn-description">
            Phù hợp với các nhu cầu cá nhân như xác định quan hệ huyết thống (cha - con, mẹ - con, anh - em) mà không sử dụng vào mục đích pháp lý.
          </p>
          <ul className="adn-features">
            <li>Không yêu cầu giấy tờ tùy thân</li>
            <li>Mẫu có thể thu tại nhà hoặc gửi qua đường bưu điện</li>
            <li>Bảo mật tuyệt đối thông tin khách hàng</li>
          </ul>
          <Link to="/requestFormCivil">
            <button className="adn-button">Đặt lịch xét nghiệm</button>
          </Link>
        </div>

        <div className="adn-card">
          <h3>XÉT NGHIỆM ADN HÀNH CHÍNH</h3>
          <p className="adn-description">
            Sử dụng trong các thủ tục pháp lý như khai sinh, nhập tịch, nhận con, thừa kế... có giá trị trước pháp luật.
          </p>
          <ul className="adn-features">
            <li>Yêu cầu giấy tờ tùy thân hợp lệ (CMND/CCCD/Khai sinh)</li>
            <li>Quy trình lấy mẫu nghiêm ngặt tại trung tâm</li>
            <li>Kết quả có thể sử dụng trong hồ sơ pháp lý</li>
          </ul>
          <Link to="/requesFormtLegal">
            <button className="adn-button">Đặt lịch xét nghiệm</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdnBooking;
