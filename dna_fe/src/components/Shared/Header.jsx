import React, { useEffect, useState } from 'react';
import '../../styles/components/shared/header.css';
import logo from '../../assets/logo.jpg';

const Header = () => {
  const [fullName, setFullName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const savedFullName = localStorage.getItem('fullName');
    if (savedFullName) {
      setFullName(savedFullName);
    }

    const handleStorageChange = () => {
      const updatedFullName = localStorage.getItem('fullName');
      setFullName(updatedFullName || '');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
          {fullName ? (
            <div className="user-menu">
              <span onClick={toggleDropdown} className="user-name">
                👤 {fullName}
              </span>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <a href="/orders">Đơn hàng</a>
                  <a href="/profile">Hồ sơ</a>
                  <span onClick={handleLogout} className="logout-btn">Đăng xuất</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <a className='register-link' href="/register">Đăng ký</a> | <a className='login-link' href="/login">Đăng nhập</a>
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
