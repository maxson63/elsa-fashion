import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Users, 
  Package,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { ambassador } = useAuth();

  const navItems = [
    {
      name: 'Home',
      icon: Home,
      path: '/',
      activeIcon: Home,
    },
    {
      name: 'Shop',
      icon: ShoppingBag,
      path: '/shop',
      activeIcon: ShoppingBag,
    },
    {
      name: ambassador ? 'Dashboard' : 'Collab',
      icon: Users,
      path: ambassador ? '/ambassador/dashboard' : '/elsa-collab',
      activeIcon: Users,
    },
    {
      name: 'Track',
      icon: Package,
      path: '/user/delivery-tracking',
      activeIcon: Package,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom home-indicator-aware">
      <div className="flex justify-around items-center h-16 sm:h-20 nav-pro-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 touch-target ${
                active 
                  ? 'text-purple-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${
                    active ? 'scale-110' : 'scale-100'
                  }`} 
                />
                {active && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-600 rounded-full"></div>
                )}
              </div>
              <span className={`text-xs sm:text-sm mt-1 font-medium transition-all duration-200 text-pro-max ${
                active ? 'text-purple-600' : 'text-gray-400'
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
