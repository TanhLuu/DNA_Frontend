import React, { useEffect, useState } from 'react';
import '../../styles/components/header.css';
import logo from '../../assets/logo.jpg';

import { Link ,useNavigate} from 'react-router-dom';


const Header = () => {
 const navigate = useNavigate(); 
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const savedFullName = localStorage.getItem('fullName');
    if (savedFullName) {
      setFullName(savedFullName);
    }

    //  sự kiện storage để phát hiện thay đổi localStorage
    const handleStorageChange = () => {
      const updatedFullName = localStorage.getItem('fullName');
      console.log('Storage changed, fullName:', updatedFullName);
      setFullName(updatedFullName || '');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    console.log('Logging out, removing username and role');
    localStorage.clear();
    window.location.href = '/login';
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

             <>
              <span 
                onClick={() => navigate('/profile')} 
                style={{ cursor: 'pointer' }}
              >
                👤 {fullName}
              </span> |{' '}

              <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Đăng xuất
              </a>
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

         <Link to="/history" className="nav-link">Lịch sử xét nghiệm</Link>
          <a href="/guide"><strong>Hướng dẫn</strong></a>
           <Link to="/news"><strong>Tin tức</strong></Link>
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