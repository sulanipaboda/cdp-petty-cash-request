// src/components/PublicNavigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Sun, Moon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../store/userSlice';
import logo from '../assets/logo.png';

const PublicNavigation = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.user.theme);

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="p-2 bg-primary-600 rounded-2xl group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-primary-200 dark:shadow-none">
              <img src={logo} alt="CDP Logo" className="h-8 w-auto brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-gray-900 dark:text-gray-100 text-xl leading-none uppercase tracking-tighter">Petty Cash</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] font-black mt-1">Request Portal</span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all duration-200"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavigation;
