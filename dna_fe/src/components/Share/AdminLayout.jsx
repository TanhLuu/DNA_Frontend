import React from 'react';
import Sidebar from '../../components/Share/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;