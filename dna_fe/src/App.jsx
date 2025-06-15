import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Shared/Header';
import Footer from './components/Shared/Footer';
import AdminLayout from './components/Shared/AdminLayout';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPasswordFromEmail from './pages/auth/ResetPasswordFromEmail';
import ResetPassword from './pages/auth/ResetPassword';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import OrdersPage from './pages/admin/OrdersPage';
import Profile from './components/Shared/Profile';
import ServiceManagement from './pages/admin/ServiceManagement';
import Dashboard from './pages/admin/Dashboard';
import './styles/global.css';



function App() {
  const [role, setRole] = useState(localStorage.getItem('role')?.toLowerCase());

  // Thêm cơ chế tự kiểm tra localStorage
  useEffect(() => {
    const checkRole = () => {
      const currentRole = localStorage.getItem('role')?.toLowerCase();
      if (currentRole !== role) {
        setRole(currentRole);
      }
    };
    
    // Kiểm tra mỗi 100ms
    const interval = setInterval(checkRole, 100);
    return () => clearInterval(interval);
  }, [role]);

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem('role')?.toLowerCase());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

    return (
    <Router>
      <div className="app">
        {(role !== 'staff' && role !== 'manager') && <Header />}

        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/change-password" element={<ResetPassword />} />
            <Route path="/reset-password" element={<ResetPasswordFromEmail />} />
            {(role === 'staff' || role === 'manager') && (
              <>
                <Route
                  path="/ordersPageAdmin"
                  element={
                    <AdminLayout>
                      <OrdersPage />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/serviceManagement"
                  element={
                    <AdminLayout>
                      <ServiceManagement />
                    </AdminLayout>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  }
                />
                
              </>
            )}
 
            {(!role || role === 'customer') && (
              <Route path="/" element={<Home />} />
            )}

            {role === 'customer' && (
              <Route path="/profile" element={<Profile />} />
            )}
           

            <Route path="*" element={
              (role === 'staff' || role === 'manager') ? (
                <Navigate to="/ordersPageAdmin" replace />
              ) : (
                <Navigate to="/" replace />
              )
            } />
          </Routes>
        </main>

        {(role !== 'staff' && role !== 'manager') && <Footer />}
      </div>
    </Router>
  );
}

export default App;