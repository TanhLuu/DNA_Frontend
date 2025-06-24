import React, { useState, useEffect } from 'react';
import './styles/global.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Share/Header';
import Footer from './components/Share/Footer';
import AdminLayout from './components/Share/AdminLayout';
import ResetPasswordFromEmail from './pages/auth/ResetPasswordFromEmail';
import ResetPassword from './components/UI/Auth/ResetPassword';
import Home from './pages/Home';
import OrdersPage from './pages/admin/OrdersPage';
import Profile from './components/Profile';
import ServiceManagement from './pages/admin/ServiceManagement';
import Dashboard from './pages/admin/Dashboard';
import ADNRequestFormCivil from './components/ADN_Form/ADNRequestFormCivil';
import ADNRequestLegalForm from './components/ADN_Form/ADNRequestLegalForm';
import CivilServicePricing from './pages/Pricing/CivilServicePricing';
import LegalServicePricing from './pages/Pricing/LegalServicePricing';
import AllServicePricing from './pages/Pricing/AllServicePricing';
import OrderHistory from './pages/customer/OrderHistory';
import OrderDetailAdmin from './pages/admin/OrderDetailAdmin';
import OrderDetailCustomer from './pages/customer/OrderDetailCustomer';
import TestResultInput from './pages/admin/TestResultInput';


function App() {
  const [role, setRole] = useState(localStorage.getItem('role')?.toLowerCase());
  useEffect(() => {
    const checkRole = () => {
      const currentRole = localStorage.getItem('role')?.toLowerCase();
      if (currentRole !== role) {
        setRole(currentRole);
      }
    };

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
            <Route path="/change-password" element={<ResetPassword />} />
            <Route path="/reset-password" element={<ResetPasswordFromEmail />} />
            <Route path="/requestFormCivil" element={<ADNRequestFormCivil />} />
            <Route path="/requesFormtLegal" element={<ADNRequestLegalForm />} />
            <Route path="/civil-price" element={<CivilServicePricing />} />
            <Route path="/legal-price" element={<LegalServicePricing />} />
            <Route path="/all-price" element={<AllServicePricing />} />

            {(role === 'staff' || role === 'manager') && (
              <>
                <Route path="/ordersPageAdmin" element={<AdminLayout> <OrdersPage /> </AdminLayout>} />
                <Route path="/serviceManagement" element={<AdminLayout> <ServiceManagement /> </AdminLayout>}/>
                <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>}/>
                <Route path="/admin/orders/:orderId" element={<AdminLayout><OrderDetailAdmin /></AdminLayout>} />
                <Route path="/admin/test-result-input/:orderId" element={<AdminLayout><TestResultInput /></AdminLayout>} />
              </>
            )}

            {(!role || role === 'customer') && (
              <Route path="/" element={<Home />} />
            )}

            {role === 'customer' && (
              <>
                <Route path="/profile" element={<Profile />} />
                <Route path="/OrderHistory" element={<OrderHistory />} />
                <Route path="/customer/orders/:orderId" element={<OrderDetailCustomer />} />

              </>
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