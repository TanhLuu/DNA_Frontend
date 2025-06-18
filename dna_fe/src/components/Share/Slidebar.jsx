import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStaffInfo } from '../../hooks/useStaffInfo';
import '../../styles/components/shared/slidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const { name, role } = useStaffInfo();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="admin-sidebar">
      <div>
        <div className="admin-user">{name}</div>
        <div className="admin-role">{role}</div>
        <nav className="admin-nav">
          <Link to="/ordersPageAdmin">Đơn xét nghiệm</Link>
          <Link to="/serviceManagement">Quản lý dịch vụ</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/B">Quản lý feedback</Link>
        </nav>
      </div>
      <div className="admin-controls">
        <button className="admin-back" onClick={handleBack}>⬅ Trở về</button>
        <button className="admin-logout" onClick={handleLogout}>↩ Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
