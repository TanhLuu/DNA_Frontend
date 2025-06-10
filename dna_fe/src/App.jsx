import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Shared/Header';
import Footer from './components/Shared/Footer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import CivilPrice from './pages/CivilPrice';
import LegalPrice from './pages/LegalPrice';
import QRCode from './pages/auth/QRCode';
import CompletePayment from './pages/auth/CompletePayment';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/admin" element={<h2>Trang admin</h2>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/civil-price" element={<CivilPrice />} />
            <Route path="/legal-price" element={<LegalPrice />} />
            <Route path="/payment/:orderId" element={<QRCode />} />
  <Route path="/payment/complete/:orderId" element={<CompletePayment />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
