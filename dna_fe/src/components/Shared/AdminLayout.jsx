import React from 'react';
import Sidebar from '../../components/Shared/Slidebar';
import '../../styles/components/adminLayout.css';

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
