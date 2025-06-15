import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Shared/Header';
import Footer from './components/Shared/Footer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import DichVu from './pages/DichVu';
import BangGia from './pages/BangGia';
import TienTrinh from './pages/TienTrinh';
import TuThuGuiMau from './pages/TuThu&GuiMau';
import TuThuGuiMauTT from './pages/TuThu&GuiMauTT';
import ChuyenMau from './pages/ChuyenMau';
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
            <Route path="/dich-vu" element={<DichVu />} />
            <Route path="/bang-gia" element={<BangGia />} />
          </Routes>
        </main>
        

        <Footer />

      </div>
    </Router>
  );
}

export default App;
