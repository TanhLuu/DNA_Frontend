import React, { useEffect, useState } from "react";
import "../../styles/components/slidebar.css";
import { Link, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [user, setUser] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    setUser({
      name: localStorage.getItem('fullName'),
      role: localStorage.getItem('role')
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-user">{user.name}</div>
          <div className="admin-role">{user.role}</div>
          <nav className="admin-nav">
            <Link to="/ordersPageAdmin">Đơn xét nghiệm</Link>
            <Link to="/profile">Hồ sơ người dùng</Link>
            <Link to="/serviceManagement">Quản lý dịch vụ</Link>
            <Link to="#">Dashboard</Link>
            <Link to="#">Quản lý feedback</Link>
          </nav>
        </div>
        <div className="admin-controls">
          <button className="admin-back" onClick={handleBack}>⬅ Trở về</button>
          <button className="admin-logout" onClick={handleLogout}>↩ Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
