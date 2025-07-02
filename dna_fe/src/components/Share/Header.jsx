import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/shared/header.css';
import logo from '../../assets/logo.jpg';

const Header = () => {
  const [fullName, setFullName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
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

  useEffect(() => {
    let lastScrollTop = 0;
    const topBar = document.querySelector('.top-bar');

    const handleScroll = () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 50) {
        topBar.classList.add('hidden');
      } else if (scrollTop <= 50) {
        topBar.classList.remove('hidden');
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

  const redirectToAuth = (form) => {
    const url = new URL(window.location.origin + '/auth');
    url.searchParams.set('form', form);
    window.location.href = url.toString();
  };

  return (
    <header className="header-outer">
      <div className="top-bar">
        <div className="contact-info">
          <span>📞 1900 565656</span>
          <span>📧 contact@adntest.vn</span>
          <span>📍 123 Đường ABC, Q.1, TP.HCM</span>
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

        <button className="menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-center ${menuOpen ? 'show' : ''}`}>
          <a href="/">Trang chủ</a>
          <a href="/services">Dịch vụ</a>
          <div className="price-dropdown">
            <a href="/all-price">
              Bảng giá <span style={{ fontSize: '12px' }}>▾</span>
            </a>
            <div className="price-dropdown-menu">
              <a href="/civil-price">Dân sự</a>
              <a href="/legal-price">Pháp lý</a>
            </div>
          </div>
          <a href="/order-detail">Hướng dẫn</a>
          <a href="/blog">Tin tức</a>
        </nav>

        <div className={`auth-links ${isDropdownOpen ? 'active' : ''}`}>
          {fullName ? (
            <div className="user-menu">
              <button onClick={toggleDropdown} className="user-name">
                <span className="user-avatar">{getInitial(fullName)}</span>
                {fullName} <span style={{ fontSize: '12px', marginLeft: '4px' }}>▾</span>
              </button>
              <div className="dropdown-menu">
                <a href="/OrderHistory">Đơn hàng</a>
                <a href="/profile">Cài đặt</a>
                <span onClick={handleLogout} className="logout-btn">Đăng xuất</span>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="auth-slide-button" onClick={() => redirectToAuth('login')}>
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