import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AmbassadorLogin from './pages/AmbassadorLogin';
import AmbassadorRegister from './pages/AmbassadorRegister';
import AmbassadorDashboard from './pages/AmbassadorDashboard';
import ClearanceForm from './pages/ClearanceForm';
import ClearancePayment from './pages/ClearancePayment';
import LocalPayment from './pages/LocalPayment';
import ElsaCollab from './pages/ElsaCollab';
import CatalogPage from './pages/CatalogPage';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import DeliveryTracking from './pages/DeliveryTracking';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white pb-16 sm:pb-20">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/elsa-collab" element={<ElsaCollab />} />
                <Route path="/ambassador/login" element={<AmbassadorLogin />} />
                <Route path="/ambassador/register" element={<AmbassadorRegister />} />
                <Route path="/ambassador/dashboard" element={<AmbassadorDashboard />} />
                <Route path="/ambassador/clearance" element={<ClearanceForm />} />
                <Route path="/ambassador/clearance-payment" element={<ClearancePayment />} />
                <Route path="/select-outfits" element={<CatalogPage />} />
                <Route path="/local-payment" element={<LocalPayment />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/delivery-tracking" element={<DeliveryTracking />} />
              </Routes>
            </main>
            <BottomNavigation />
            <Toaster position="top-right" />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
