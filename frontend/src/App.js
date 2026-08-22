import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getApiUrl } from './config/api';

// Handle Google OAuth token at app level
const OAuthTokenHandler = () => {
  const { setAuthState } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store token and get user info
      localStorage.setItem('ambassadorToken', token);
      fetch(getApiUrl('/api/ambassadors/profile'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setAuthState(token, {
              _id: data.id,
              email: data.email,
              isVerified: data.isVerified,
              balance: data.balance,
              clearanceStatus: data.clearanceStatus,
              clearancePaymentStatus: data.clearancePaymentStatus || 'pending'
            });
            // Clear token from URL
            window.history.replaceState({}, '', window.location.pathname);
          }
        })
        .catch(err => {
          console.error('Error fetching profile after Google auth:', err);
        });
    }
  }, [location.search, setAuthState]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white pb-16 sm:pb-20">
            <Navbar />
            <main>
              <OAuthTokenHandler />
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
