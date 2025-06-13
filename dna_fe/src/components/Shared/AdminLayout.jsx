import React from 'react';
import Sidebar from '../Admin/Slidebar';
import '../../styles/components/shared/adminLayout.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <Sidebar />
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
