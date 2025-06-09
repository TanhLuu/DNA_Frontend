import React, { useEffect, useState } from 'react';
import '../../styles/components/header.css';
import logo from '../../assets/logo.jpg';

const Header = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = '/login'; // hoặc dùng navigate nếu có hook
  };

  return (
    <header className="header">
      <div className="top-bar">
        <div className="contact-info">
          <span>📞 1900 565656</span>
          <span>📧 contact@adntest.vn</span>
          <span>📍 123 Đường ABC, Q.1, TP.HCM</span>
        </div>
        <div className="auth-links">
          {username ? (
            <>
              <span>👤 {username}</span> | <a onClick={handleLogout} style={{ cursor: 'pointer' }}>Đăng xuất</a>
            </>
          ) : (
            <>
              <a href="/register">Đăng ký</a> | <a href="/login">Đăng nhập</a>
            </>
          )}
        </div>
      </div>

      <div className="main-nav">
        <div className="logo-section">
          <img src={logo} alt="MedLab Logo" className="logo" />
          <div className="logo-text">
            <strong>MEDLAB</strong>
            <div className="slogan">Xét nghiệm ADN hàng đầu</div>
          </div>
        </div>
        <nav className="menu">
          <a href="/"><strong>Trang chủ</strong></a>
          <a href="/services"><strong>Dịch vụ</strong></a>
          <a href="/pricing"><strong>Bảng giá</strong></a>
          <a href="/guide"><strong>Hướng dẫn</strong></a>
          <a href="/news"><strong>Tin tức</strong></a>
        </nav>
        <div className="search-box">
          <input type="text" placeholder="Tìm kiếm..." />
          <button>🔍</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
