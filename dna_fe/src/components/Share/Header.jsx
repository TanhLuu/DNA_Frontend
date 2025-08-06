import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/shared/header.css';
import logo from '../../assets/logo.jpg';

const Header = () => {
  const [fullName, setFullName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFullName = localStorage.getItem('fullName');
    if (savedFullName) setFullName(savedFullName);

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

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

  const redirectToAuth = (form) => {
    const url = new URL(window.location.origin + '/auth');
    url.searchParams.set('form', form);
    window.location.href = url.toString();
  };

  return (
    <header className="medlab-header-outer">
      <div className="medlab-header-top-bar">
        <div className="medlab-header-contact-info">
          <span>📞 1900 565656</span>
          <span>📧 contact@adntest.vn</span>
          <span>📍 123 Đường ABC, Q.1, TP.HCM</span>
        </div>
      </div>

      <div className="medlab-header-main-nav">
        <div className="medlab-header-logo-section">
          <img src={logo} alt="MedLab Logo" className="medlab-header-logo" />
          <div className="medlab-header-logo-text">
            <strong>MEDLAB</strong>
            <div className="slogan">Xét nghiệm ADN hàng đầu</div>
          </div>
        </div>

        

        <nav className={`medlab-header-nav-center ${menuOpen ? 'show' : ''}`}>
          <a href="/">Trang chủ</a>
          <a href="/blog?type=Dịch vụ">Dịch vụ</a>
          <div className="medlab-header-price-dropdown">
            <a href="/all-price">Bảng giá <span style={{ fontSize: '12px' }}>▾</span></a>
            <div className="medlab-header-price-dropdown-menu">
              <a href="/civil-price">Dân sự</a>
              <a href="/legal-price">Pháp lý</a>
            </div>
          </div>
          <a href="/blog?type=Hướng dẫn">Hướng dẫn</a>
          <a href="/blog?type=Tin tức">Tin tức</a>
        </nav>

        <div className={`medlab-header-auth-links ${isDropdownOpen ? 'active' : ''}`}>
          {fullName ? (
            <div className="medlab-header-user-menu">
              <button onClick={toggleDropdown} className="medlab-header-user-name">
                <span className="medlab-header-user-avatar">{getInitial(fullName)}</span>
                {fullName} <span style={{ fontSize: '12px', marginLeft: '4px' }}>▾</span>
              </button>
              <div className="medlab-header-dropdown-menu">
                <a href="/OrderHistory">Đơn hàng</a>
                <a href="/profile">Cài đặt</a>
                <span onClick={handleLogout} className="medlab-header-logout-btn">Đăng xuất</span>
              </div>
            </div>
          ) : (
            <div className="medlab-header-auth-buttons">
              <button className="medlab-header-auth-slide-button" onClick={() => redirectToAuth('login')}>
                Đăng nhập / Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
