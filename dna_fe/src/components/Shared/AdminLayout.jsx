import React, { useEffect, useState } from "react";
// import { getUserInfo } from "../api/adminApi";
import "../../styles/components/adminLayout.css";


const AdminLayout = ({ children }) => {
  const [user, setUser] = useState({ name: "", role: "" });

//   useEffect(() => {
//     async function fetchUser() {
//       const res = await getUserInfo();
//       setUser(res);
//     }
//     fetchUser();
//   }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div>
          <div className="admin-user">{user.name}</div>
          <div className="admin-role">{user.role}</div>
          <nav className="admin-nav">
            <a href="/admin/orders">Đơn xét nghiệm</a>
            <a href="#">Hồ sơ người dùng</a>
            <a href="#">Quản lý dịch vụ</a>
            <a href="#">Dashboard</a>
            <a href="#">Quản lý feedback</a>
          </nav>
        </div>
        <button className="admin-logout">↩ Logout</button>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
