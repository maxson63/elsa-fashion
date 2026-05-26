import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cart } = useCart();
  const { ambassador, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveLink = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-black">Elsa Fashionis</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`nav-link ${isActiveLink('/') ? 'nav-link-active' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`nav-link ${isActiveLink('/shop') ? 'nav-link-active' : ''}`}
            >
              Shop
            </Link>
            <Link
              to="/elsa-collab"
              className={`nav-link ${isActiveLink('/elsa-collab') ? 'nav-link-active' : ''}`}
            >
              Elsa Collab
            </Link>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Link>

            {/* User Sign In (for regular shoppers) */}
            <Link to="/user/login" className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Sign In</span>
            </Link>

            {/* Ambassador Account */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-6 h-6" />
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    <Link
                      to="/ambassador/dashboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/ambassador/clearance"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Clearance
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/ambassador/login"
                className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Ambassador</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button and sign-in */}
          <div className="md:hidden flex items-center space-x-2">
            {/* User Sign In (for regular shoppers) */}
            <Link to="/user/login" className="flex items-center space-x-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Sign In</span>
            </Link>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg ${isActiveLink('/') ? 'bg-gray-100 text-black' : 'text-gray-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`block px-4 py-2 rounded-lg ${isActiveLink('/shop') ? 'bg-gray-100 text-black' : 'text-gray-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/elsa-collab"
              className={`block px-4 py-2 rounded-lg ${isActiveLink('/elsa-collab') ? 'bg-gray-100 text-black' : 'text-gray-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Elsa Collab
            </Link>
            
            {/* User Sign In (for regular shoppers) */}
            <Link
              to="/user/login"
              className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/ambassador/dashboard"
                  className="block px-4 py-2 rounded-lg text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/ambassador/clearance"
                  className="block px-4 py-2 rounded-lg text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Clearance
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 rounded-lg text-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/ambassador/login"
                className="block px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Ambassador Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
