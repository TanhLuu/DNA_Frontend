import React, { useEffect, useState } from "react";
import "../../styles/components/shared/slidebar.css";
import { Link, useNavigate } from 'react-router-dom';
import { getStaffByAccountId } from '../../api/accountApi'; // Hoặc từ staffApi nếu đã tách

const AdminLayout = ({ children }) => {
  const [user, setUser] = useState({ name: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fullName = localStorage.getItem('fullName');
    const role = localStorage.getItem('role'); // STAFF hoặc MANAGER
    const accountId = localStorage.getItem('accountId');

    if (role === 'STAFF') {
      // Nếu là STAFF → gọi API lấy staffType từ bảng Staff
      getStaffByAccountId(accountId)
        .then((staff) => {
          const translatedRole =
            staff.staffType === 0
              ? 'Nhân viên thường'
              : staff.staffType === 1
              ? 'Nhân viên xét nghiệm'
              : 'Nhân viên';
          setUser({ name: fullName, role: translatedRole });
        })
        .catch(() => {
          setUser({ name: fullName, role: 'Nhân viên' });
        });
    } else if (role === 'MANAGER') {
      setUser({ name: fullName, role: 'Quản lý' });
    } else {
      setUser({ name: fullName, role: role }); // fallback
    }
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
            <Link to="/serviceManagement">Quản lý dịch vụ</Link>
            <Link to="/dashboard">Dashboard</Link>
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
