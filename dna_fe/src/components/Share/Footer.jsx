import React from 'react';
import '../../styles/components/shared/footer.css';
import * as asset from '../../assets';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo + Mô tả */}
        <div className="footer-brand">
  <div className="footer-logo-group">
    <img src={asset.logo} alt="MedLab Logo" className="footer-logo" />
    <span className="footer-brand-name">MEDLAB</span>
  </div>
  <p className="footer-tagline">TRUNG TÂM XÉT NGHIỆM ADN ĐÁNG TIN CẬY HÀNG ĐẦU VIỆT NAM.</p>
</div>

        {/* Liên kết */}
        <div className="footer-links">
          <div>
            <h4>Thông tin</h4>
            <ul>
              <li><a href="/about">Về MedLab</a></li>
              <li><a href="/services">Dịch vụ</a></li>
              <li><a href="/pricing">Bảng giá</a></li>
              <li><a href="/contact">Liên hệ</a></li>
            </ul>
          </div>
          <div>
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="/guide">Hướng dẫn</a></li>
              <li><a href="/privacy">Chính sách</a></li>
              <li><a href="/terms">Điều khoản</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        © 2025 MedLab. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;