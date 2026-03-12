// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ClipboardList, 
  LayoutDashboard, 
  Users as UsersIcon, 
  ShieldCheck, 
  Key,
  History
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const mainNav = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const userManagementNav = [
    { path: '/users', label: 'Users', icon: UsersIcon },
    { path: '/roles', label: 'Roles', icon: ShieldCheck },
    { path: '/permissions', label: 'Permissions', icon: Key },
  ];

  const systemNav = [
    { path: '/logs', label: 'Audit Logs', icon: History },
  ];

  // No longer hiding sidebar on any page
  
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:block overflow-hidden transition-colors duration-300 z-30">
      <div className="p-4 space-y-6">
        <div>
          <p className="px-4 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Main Menu</p>
          <div className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">User Management</p>
          <div className="space-y-1">
            {userManagementNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">System</p>
          <div className="space-y-1">
            {systemNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-600'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
