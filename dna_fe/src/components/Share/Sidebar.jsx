import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStaffInfo } from '../../hooks/Account/useStaffInfo';
import { FaUsers, FaClipboardList, FaWrench, FaChartBar, FaComments, FaArrowCircleLeft, FaUserCircle, FaPowerOff, FaAngleDoubleLeft, FaAngleDoubleRight, FaBook, FaUser } from 'react-icons/fa';
import AdminProfile from '../../pages/admin/AdminProfile';

const Sidebar = () => {
  const navigate = useNavigate();
  const { name, role } = useStaffInfo();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

  const toggleLogoutMenu = () => {
    setShowLogout(!showLogout);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <>
      <aside
        className={`${isCollapsed ? 'w-16' : 'w-64'
          } h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col justify-between shadow-lg transition-all duration-300 ease-in-out overflow-y-auto`}
      >
        {/* Top: Toggle Button */}
        <div className={`p-4 border-b border-gray-600/30 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={toggleSidebar}
            className={`flex items-center p-3 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors duration-200 ${isCollapsed ? 'justify-center w-10 h-10' : 'w-full'
              }`}
            title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
          >
            <FaAngleDoubleLeft className={`text-lg ${isCollapsed ? 'hidden' : 'block'}`} />
            <FaAngleDoubleRight className={`text-lg ${isCollapsed ? 'block' : 'hidden'}`} />
            {!isCollapsed && (
              <span className="ml-3 text-sm opacity-100 transition-opacity duration-200">
                {isCollapsed ? 'Mở rộng' : 'Thu gọn'}
              </span>
            )}
          </button>
        </div>

        {/* Middle: Navigation */}
        <div className="p-4 flex-1">
          <nav className={`space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            <Link
              to="/ordersPageAdmin"
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 hover:scale-105 transform ${isCollapsed ? 'justify-center' : ''
                }`}
              title={isCollapsed ? 'Đơn xét nghiệm' : ''}
            >
              <FaClipboardList className="text-lg" />
              {!isCollapsed && (
                <span className="ml-3 text-sm opacity-100 transition-opacity duration-200">
                  Đơn xét nghiệm
                </span>
              )}
            </Link>

            <Link
              to="/serviceManagement"
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 hover:scale-105 transform ${isCollapsed ? 'justify-center' : ''
                }`}
              title={isCollapsed ? 'Dịch vụ' : ''}
            >
              <FaWrench className="text-lg" />
              {!isCollapsed && (
                <span className="ml-3 text-sm opacity-100 transition-opacity duration-200">
                  Dịch vụ
                </span>
              )}
            </Link>

            {role === 'MANAGER' && (
              <Link
                to="/dashboard"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 hover:scale-105 transform ${isCollapsed ? 'justify-center' : ''
                  }`}
                title={isCollapsed ? 'Dashboard' : ''}
              >
                <FaChartBar className="text-lg" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm opacity-100 transition-opacity duration-200">
                    Dashboard
                  </span>
                )}
              </Link>
            )}

            {role === 'MANAGER' && (
              <Link
                to="/account-management"
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 hover:scale-105 transform ${isCollapsed ? 'justify-center' : ''
                  }`}
                title={isCollapsed ? 'Quản lý tài khoản' : ''}
              >
                <FaUsers className="text-lg" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm opacity-100 transition-opacity duration-200">
                    Quản lý tài khoản
                  </span>
                )}
              </Link>
            )}

            <Link
              to="/rating-feedbacks"
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 hover:scale-105 transform ${isCollapsed ? 'justify-center' : ''
                }`}
              title={isCollapsed ? 'Quản lý feedback' : ''}
            >
              <FaComments className="text-lg" />
              {!isCollapsed && (
                <span className="ml-3 text-sm opacity-100 transition-opacity duration-200">
                  Quản lý feedback
                </span>
              )}
            </Link>

            <Link
              to="/blog-management"
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 hover:scale-105 transform ${isCollapsed ? 'justify-center' : ''
                }`}
              title={isCollapsed ? 'Bài viết' : ''}
            >
              <FaBook className="text-lg" />
              {!isCollapsed && (
                <span className="ml-3 text-sm opacity-100 transition-opacity duration-200">
                  Bài viết
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* Bottom: User Info + Profile + Logout */}
        <div className={`p-4 border-t border-gray-600/30 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          <button
            onClick={handleBack}
            className={`flex items-center p-3 rounded-lg hover:bg-gray-500 transition-colors duration-200 hover:scale-105 transform mt-2 ${isCollapsed ? 'justify-center w-10 h-10' : 'w-full'
              }`}
            title={isCollapsed ? 'Trở về' : ''}
          >
            <FaArrowCircleLeft className="text-lg" />
            {!isCollapsed && (
              <span className="ml-3 text-sm opacity-100 transition-opacity duration-200">
                Trở về
              </span>
            )}
          </button>

          <div
            onClick={toggleLogoutMenu}
            className={`cursor-pointer flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 hover:scale-105 transform mt-2 ${isCollapsed ? 'justify-center w-10 h-10' : 'w-full'
              }`}
            title={isCollapsed ? name || 'Người dùng' : ''}
          >
            <div className="w-10 h-10 rounded-full bg-gray-600/50 flex items-center justify-center">
              <FaUserCircle className="text-lg" />
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex flex-col">
                <span className="text-sm font-semibold opacity-100 transition-opacity duration-200">
                  {name || 'Người dùng'}
                </span>
                <span className="text-xs opacity-80 transition-opacity duration-200">
                  {role ? role.replace('_', ' ') : 'Vai trò không xác định'}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && showLogout && (
            <>
              <button
                onClick={openProfileModal}
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 hover:scale-105 transform mt-2 w-full"
                title="Hồ sơ cá nhân"
              >
                <FaUser className="text-lg" />
                <span className="ml-3 text-sm opacity-100 transition-opacity duration-200">
                  Hồ sơ cá nhân
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full mt-2 p-3 bg-red-600 rounded-lg hover:bg-red-500 text-sm transition-colors duration-200 opacity-100 transition-opacity duration-300 flex items-center justify-center hover:scale-105 transform"
              >
                <FaPowerOff className="mr-2 text-lg" />
                Đăng xuất
              </button>
            </>
          )}

          {isCollapsed && showLogout && (
            <button
              onClick={openProfileModal}
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 hover:scale-105 transform mt-2 ${isCollapsed ? 'justify-center w-10 h-10' : 'w-full'
                }`}
              title="Hồ sơ cá nhân"
            >
              <FaUser className="text-lg" />
            </button>
          )}

          {isCollapsed && showLogout && (
            <button
              onClick={handleLogout}
              className={`flex items-center p-3 rounded-lg bg-red-600 hover:bg-red-500 transition-colors duration-200 hover:scale-105 transform mt-2 ${isCollapsed ? 'justify-center w-10 h-10' : 'w-full'
                }`}
              title="Đăng xuất"
            >
              <FaPowerOff className="text-lg" />
            </button>
          )}
        </div>
      </aside>

      <AdminProfile isOpen={isProfileModalOpen} onClose={closeProfileModal} />
    </>
  );
};

export default Sidebar;