import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ClipboardList, 
  LayoutDashboard, 
  Users as UsersIcon, 
  ShieldCheck, 
  Key,
  History,
  MapPin,
  Tag,
  Building2
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.currentUser);

  // Helper function to check if user has a permission
  const hasPermission = (permissionName) => {
    if (!currentUser) return false;
    
    // Check if user is Super Admin
    const roles = currentUser.roles || [];
    if (roles.some(role => role.name === 'Super Admin')) return true;

    // Check individual permissions
    return roles.some(role => 
      (role.permissions || []).some(p => p.name === permissionName)
    );
  };

  const menuGroups = [
    {
      label: 'Main Menu',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      label: 'User Management',
      items: [
        { path: '/users', label: 'Users', icon: UsersIcon, permission: 'User Index' },
        { path: '/roles', label: 'Roles', icon: ShieldCheck, permission: 'Role Index' },
        { path: '/permissions', label: 'Permissions', icon: Key, permission: 'Permission Index' },
      ]
    },
    {
      label: 'Master Data',
      items: [
        { path: '/branches', label: 'Branches', icon: MapPin, permission: 'Branch Index' },
        { path: '/categories', label: 'Categories', icon: Tag, permission: 'Category Index' },
        { path: '/departments', label: 'Departments', icon: Building2, permission: 'Department Index' },
      ]
    },
    {
      label: 'System',
      items: [
        { path: '/logs', label: 'Audit Logs', icon: History, permission: 'Activity Log Index' },
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:block overflow-hidden transition-colors duration-300 z-30">
      <div className="p-4 space-y-6">
        {menuGroups.map((group) => {
          // Filter items based on permissions
          const visibleItems = group.items.filter(item => 
            !item.permission || hasPermission(item.permission)
          );

          // Only render group if it has visible items
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label}>
              <p className="px-4 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                {group.label}
              </p>
              <div className="space-y-1">
                {visibleItems.map((item) => {
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
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
