import React from 'react';
import '../../styles/components/footer.css';
import * as asset from '../../assets';;

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-col logo-col">
          <img src={asset.logo} alt="MedLab Logo" className="footer-logo" />
          <p>
            Trung tâm xét nghiệm ADN hàng đầu với hơn 10 năm kinh nghiệm, cam kết độ chính xác cao,
            bảo mật thông tin tuyệt đối và dịch vụ tận tâm.
          </p>
          <p className="copyright">© 2025 Trung tâm xét nghiệm ADN. Bảo lưu mọi quyền.</p>
        </div>

        <div className="footer-col">
          <h4>Thông tin liên hệ</h4>
          <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1,<br />TP. Hồ Chí Minh</p>
          <p><strong>Điện thoại:</strong> +84 0123 456 789</p>
          <p><strong>Email:</strong> contact@adntest.vn</p>
          <p><strong>Giờ làm việc:</strong> Thứ 2 - Thứ 7, 8:00 - 18:00</p>
        </div>

        <div className="footer-col">
          <h4>Liên kết nhanh</h4>
          <ul className="footer-links">
            <li><a href="/services">Dịch vụ</a></li>
            <li><a href="/pricing">Bảng giá</a></li>
            <li><a href="/contact">Liên hệ</a></li>
            <li><a href="/guide">Hướng dẫn</a></li>
            <li><a href="/news">Tin tức</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Kết nối với chúng tôi</h4>
          <div class="social-icons">
            <a href="#"><i className="fab fa-facebook-f">Facebook</i></a>
            <a href="#"><i className="fab fa-zalo">Zalo</i></a>
            <a href="#"><i className="fab fa-youtube">YouTube</i></a>
          </div>
          <div className="certifications">
            <h4>Chứng nhận uy tín</h4>
            <img src={asset.bocongthuong} className='certifications-top' alt="bocongthuong" />
            <div className="certifications-bottom">
              <img src={asset.iso} alt="ISO 9001" />
              <img src={asset.acceredited} alt="Accredited" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
