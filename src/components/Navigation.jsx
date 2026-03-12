// src/components/Navigation.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sun, Moon, User, LogOut, ChevronDown, Bell, Settings } from 'lucide-react';
import { setTheme, logout } from '../store/userSlice';
import logo from '../assets/logo.png';

const Navigation = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.user.theme);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/public/login');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 w-full transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="p-1.5 bg-primary-50 dark:bg-primary-900/30 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <img src={logo} alt="CDP Logo" className="h-8 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-gray-900 dark:text-gray-100 text-base leading-tight uppercase tracking-tighter">Petty Cash System</span>
                <span className="text-[9px] text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] font-bold">Ceylon Plantation</span>
              </div>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 md:space-x-5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Notifications (Mock) */}
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>

            {/* Profile Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2 pl-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200"
                >
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 tracking-tight">{currentUser.name}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">@{currentUser.role.split(' ')[0].toLowerCase()}</span>
                  </div>
                  <div className="h-8 w-8 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-200 dark:shadow-none">
                    <User className="h-4 w-4" />
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 z-50 animate-in fade-in zoom-in duration-200">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">{currentUser.name}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-0.5">{currentUser.role}</p>
                      </div>
                      <div className="p-1.5 mt-1 border-t border-gray-100 dark:border-gray-800">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="font-bold tracking-tight">Logout System</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;