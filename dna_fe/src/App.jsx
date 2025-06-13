// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Shared/Header';
// import Footer from './components/Shared/Footer';
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import Home from './pages/Home';
// import AdminLayout from './components/Shared/AdminLayout';
// import './styles/global.css';

// function App() {
//   return (
//     <Router>
//       <div className="app">
//         <Header />
        
//         <main className="main-content">
//           <Routes>
//             <Route path="/" element={<Home />} />

//             {/* <Route path="/admin" element={<AdminLayout />} /> */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
            
//           </Routes>
//         </main>
        
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Shared/Header';
// import Footer from './components/Shared/Footer';
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import Home from './pages/Home';
// import AdminLayout from './components/Shared/AdminLayout'; // bạn làm sau
// import './styles/global.css';

// function App() {
//   const role = localStorage.getItem('role'); // 'customer' | 'staff' | null

//   return (
//     <Router>
//       <div className="app">
//         {/* Chỉ hiển thị Header/Footer nếu là customer hoặc chưa login */}
//         {(role !== 'staff') && <Header />}

//         <main className="main-content">
//           <Routes>
//             {/* Với customer hoặc chưa login, show Home */}
//             {(role === 'customer' || !role) && <Route path="/" element={<Home />} />}

//             {/* Với staff, show trang trắng (placeholder AdminLayout sau này) */}
//             {role === 'staff' && <Route path="/admin" element={<AdminLayout />} />} 

//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//           </Routes>
//         </main>

//         {(role !== 'staff') && <Footer />}
//       </div>
//     </Router>
//   );
// }

// export default App;


//Code test role
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Shared/Header';
import Footer from './components/Shared/Footer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import AdminLayout from './components/Shared/AdminLayout';
import CivilPrice from './pages/CivilPrice';
import LegalPrice from './pages/LegalPrice';
import QRCode from './pages/auth/QRCode';
import CompletePayment from './pages/auth/CompletePayment';
import History from './pages/auth/History';
import NewsPage from './pages/auth/NewsPage';
import './styles/global.css';

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="app">
        {role !== "staff" && <Header />}

        <main className="main-content">
          <Routes>
              <Route path="/civil-price" element={<CivilPrice />} />
            <Route path="/legal-price" element={<LegalPrice />} />
            <Route path="/payment/:orderId" element={<QRCode />} />
             <Route path="/news" element={<NewsPage />} />
             <Route path="/history" element={<History />} />
  <Route path="/payment/complete/:orderId" element={<CompletePayment />} />
            {(!role || role === "customer") && <Route path="/" element={<Home />} />}

            {role === "staff" && (
              <Route
                path="/"
                element={
                  <AdminLayout>
                    
                  </AdminLayout>
                }
              />
            )}

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          
          </Routes>
        </main>

        {role !== "staff" && <Footer />}
      </div>
    </Router>
  );
}

export default App;
