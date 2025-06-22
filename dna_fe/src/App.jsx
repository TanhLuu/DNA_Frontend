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

import History from './pages/auth/History';
import NewsPage from './pages/auth/BlogList';
import Profile from './components/Profile';
import OrderCivil from './pages/auth/OrderCivil';
import OrderLegal from './pages/auth/OrderLegal';
import CivilADNGuide from './pages/auth/CivilADNGuide';
import LegalADNGuide from './pages/auth/LegalADNGuide';
import ADNft from './pages/auth/ADNfather';
import ADNgrandparent from './pages/auth/ADNgrandft';
import ADNmother from './pages/auth/ADNmother';
import ADNsibling from './pages/auth/ADNbrosis';
import BlogList from './pages/auth/BlogList';
import BlogDetail from './pages/auth/BlogDetail';
import BlogAdminList from './pages/admin/BlogAdminList';
import CreateBlog from './pages/admin/CreateBlog';
import EditBlog from './pages/admin/EditBlog';
import PaymentPage from './pages/auth/PaymentPage';
import VNPayReturnPage from './pages/auth/VNPayReturnPage';
import PaymentHistory from './pages/auth/PaymentHistory';
import './styles/global.css';


function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
    const customerId = localStorage.getItem("customerId"); 
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
           
            <Route path="/news" element={<NewsPage />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order/civil" element={<OrderCivil />} />
            <Route path="/order/legal" element={<OrderLegal />} />
             <Route path="/civil" element={<CivilADNGuide />} />
              <Route path="/legal" element={<LegalADNGuide />} />
              <Route path="/adn-father" element={<ADNft />} />
              <Route path="/grandparent" element={<ADNgrandparent />} />
               <Route path="/guide/mother" element={<ADNmother />} />
               <Route path="/guide/sibling" element={<ADNsibling />} />
         
             <Route path="/admin/blogs" element={<BlogAdminList />} />
        <Route path="/admin/create" element={<CreateBlog />} />
        <Route path="/admin/edit/:id" element={<EditBlog />} />
          <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        {role === "customer" && (
  <>
    <Route path="/payment" element={<PaymentPage />} />
    <Route path="/payment-history" element={<PaymentHistory customerId={customerId} />} />
    <Route path="/history" element={<History />} />
    <Route path="/profile" element={<Profile />} />
  </>
)}

{/* Route kết quả VNPay (ai cũng vào được khi redirect từ VNPay) */}
<Route path="/vnpay-return" element={<VNPayReturnPage />} />
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
