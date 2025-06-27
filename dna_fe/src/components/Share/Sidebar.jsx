import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStaffInfo } from '../../hooks/Account/useStaffInfo';

const Sidebar = () => {
  const navigate = useNavigate();
  const { name, role } = useStaffInfo();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleBack = () => {
    navigate(-1);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-50'
      } h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col justify-between shadow-lg transition-all duration-300 overflow-y-auto`}
    >
      {/* User Info Section */}
      <div className="p-4">
        <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-3'}`}>
          <div className="w-12 h-12 rounded-full bg-gray-600/50 flex items-center justify-center">
            <span className="text-lg font-semibold">{name?.charAt(0) || 'U'}</span> {/* Giảm từ text-xl xuống text-lg */}
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-base font-bold">{name || 'Người dùng'}</h2> {/* Giảm từ text-lg xuống text-base */}
              <p className="text-xs opacity-80">{role || 'Vai trò'}</p> {/* Giảm từ text-sm xuống text-xs */}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className={`mt-6 space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          <Link
            to="/ordersPageAdmin"
            className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Đơn xét nghiệm' : ''}
          >
            <span className="mr-3 text-lg">📋</span> {/* Giảm kích thước icon nếu cần */}
            {!isCollapsed && <span className="text-sm">Đơn xét nghiệm</span>} {/* Giảm từ font mặc định xuống text-sm */}
          </Link>
          <Link
            to="/serviceManagement"
            className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Dịch vụ' : ''}
          >
            <span className="mr-3 text-lg">⚙️</span>
            {!isCollapsed && <span className="text-sm">Dịch vụ</span>}
          </Link>
          {role === 'MANAGER' && (
            <Link
              to="/dashboard"
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? 'Dashboard' : ''}
            >
              <span className="mr-3 text-lg">📊</span>
              {!isCollapsed && <span className="text-sm">Dashboard</span>}
            </Link>
          )}
          <Link
            to="/B"
            className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Quản lý feedback' : ''}
          >
            <span className="mr-3 text-lg">💬</span>
            {!isCollapsed && <span className="text-sm">Quản lý feedback</span>}
          </Link>
        </nav>
      </div>

      {/* Control Buttons */}
      <div className={`p-4 border-t border-gray-600/30 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        <button
          onClick={handleBack}
          className={`flex items-center p-3 mb-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors ${
            isCollapsed ? 'justify-center w-10 h-10' : 'w-full'
          }`}
          title={isCollapsed ? 'Trở về' : ''}
        >
          <span className="mr-3 text-lg">⬅</span>
          {!isCollapsed && <span className="text-sm">Trở về</span>} {/* Giảm từ font mặc định xuống text-sm */}
        </button>
        <button
          onClick={handleLogout}
          className={`flex items-center p-3 mb-2 rounded-lg bg-red-600 hover:bg-red-500 transition-colors ${
            isCollapsed ? 'justify-center w-10 h-10' : 'w-full'
          }`}
          title={isCollapsed ? 'Đăng xuất' : ''}
        >
          <span className="mr-3 text-lg">↩</span>
          {!isCollapsed && <span className="text-sm">Đăng xuất</span>}
        </button>
        <button
          onClick={toggleSidebar}
          className={`flex items-center p-3 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors ${
            isCollapsed ? 'justify-center w-10 h-10' : 'w-full'
          }`}
          title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          <span className="text-lg">{isCollapsed ? '🟪' : '🟩'}</span>
          {!isCollapsed && <span className="ml-3 text-sm">{isCollapsed ? 'Mở rộng' : 'Thu gọn'}</span>} {/* Giảm từ font mặc định xuống text-sm */}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;