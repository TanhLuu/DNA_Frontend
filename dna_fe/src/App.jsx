import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Shared/Header';
import Footer from './components/Shared/Footer';
import AdminLayout from './components/Shared/AdminLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import OrdersPage from './pages/admin/OrdersPage';
import Profile from './components/Shared/Profile';
import ServiceManagement from './pages/admin/ServiceManagement';
import Dashboard from './pages/admin/Dashboard';
import './styles/global.css';


function App() {
  const [role, setRole] = useState(localStorage.getItem('role')?.toLowerCase());

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
        {role !== 'staff' && <Header />}

        <main className="main-content">
          <Routes>
            {(!role || role === 'customer') && (
              <Route path="/" element={<Home />} />
            )}

            {role === 'customer' && (
              <Route path="/profile" element={<Profile />} />
            )}

            {role === 'staff' && (
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

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        {role !== 'staff' && <Footer />}
      </div>
    </Router>
  );
}

export default App;
