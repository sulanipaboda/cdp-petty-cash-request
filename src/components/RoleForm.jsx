// src/components/RoleForm.jsx
import React, { useState, useEffect } from 'react';

const permissionsData = [
  {
    category: 'Access Management Permissions',
    permissions: ['Permission Create', 'Permission Delete', 'Permission Index', 'Permission Update', 'Role Create', 'Role Delete', 'Role Index', 'Role Update']
  },
  {
    category: 'Branch Management Permissions',
    permissions: ['Branch Create', 'Branch Delete', 'Branch Index', 'Branch Toggle Status', 'Branch Update']
  },
  {
    category: 'Country Management Permissions',
    permissions: ['Country Create', 'Country Delete', 'Country Index', 'Country Toggle Status', 'Country Update']
  },
  {
    category: 'Customer Management Permissions',
    permissions: ['Customer Create', 'Customer Delete', 'Customer Force Delete', 'Customer Index', 'Customer Restore', 'Customer Toggle Status', 'Customer Update']
  },
  {
    category: 'Dashboard Management Permissions',
    permissions: ['Dashboard View']
  },
  {
    category: 'Investment Management Permissions',
    permissions: ['Investment Approve', 'Investment Certificate', 'Investment Create', 'Investment Delete', 'Investment Index', 'Investment Update']
  },
  {
    category: 'Investment Product Permissions',
    permissions: ['Investment Product Create', 'Investment Product Delete', 'Investment Product Index', 'Investment Product Toggle Status', 'Investment Product Update']
  },
  {
    category: 'Level Management Permissions',
    permissions: ['Level Create', 'Level Delete', 'Level Index', 'Level Update']
  },
  {
    category: 'Province Management Permissions',
    permissions: ['Province Create', 'Province Delete', 'Province Index', 'Province Toggle Status', 'Province Update']
  },
  {
    category: 'Quotation Management Permissions',
    permissions: ['Quotation Create', 'Quotation Delete', 'Quotation Force Delete', 'Quotation Index', 'Quotation Restore', 'Quotation Toggle Status', 'Quotation Update']
  },
  {
    category: 'Receipt Management Permissions',
    permissions: ['Receipt Create', 'Receipt Index']
  },
  {
    category: 'Region Management Permissions',
    permissions: ['Region Create', 'Region Delete', 'Region Index', 'Region Toggle Status', 'Region Update']
  },
  {
    category: 'Report Management Permissions',
    permissions: ['Report Index']
  },
  {
    category: 'Target Management Permissions',
    permissions: ['My Targets', 'Target Create', 'Target Delete', 'Target Index', 'Target Update']
  },
  {
    category: 'Target Progress Permissions',
    permissions: ['Target Progress Index']
  },
  {
    category: 'User Management Permissions',
    permissions: ['User Create', 'User Delete', 'User Index', 'User Toggle Status', 'User Update']
  },
  {
    category: 'Zone Management Permissions',
    permissions: ['Zone Create', 'Zone Delete', 'Zone Index', 'Zone Toggle Status', 'Zone Update']
  }
];

const RoleForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    identityLabel: '',
    description: '',
    status: 'Active',
    permissions: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        permissions: initialData.permissions || []
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => {
      const newPermissions = prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission];
      return { ...prev, permissions: newPermissions };
    });
  };

  const allPermissionNames = permissionsData.flatMap(p => p.permissions);
  const isAllSelected = formData.permissions.length === allPermissionNames.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setFormData(prev => ({ ...prev, permissions: [] }));
    } else {
      setFormData(prev => ({ ...prev, permissions: allPermissionNames }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Role Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Finance Manager"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Identity Label</label>
          <input
            type="text"
            name="identityLabel"
            required
            value={formData.identityLabel}
            onChange={handleChange}
            placeholder="e.g. CORE.ADMIN"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Description</label>
          <textarea
            name="description"
            required
            rows="2"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the role responsibilities..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Status</label>
          <select
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tighter">Capability Matrix</h3>
            <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-[10px] font-bold rounded-full border border-primary-100 dark:border-primary-900/50 uppercase tracking-widest">
              Permissions
            </span>
          </div>
          <label className="flex items-center gap-3 cursor-pointer group bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors uppercase tracking-widest">Select All Permissions</span>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer transition-all bg-white dark:bg-gray-700"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {permissionsData.map((group) => (
            <div key={group.category} className="space-y-4 bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100/50 dark:border-gray-800/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                <h4 className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase tracking-[0.2em]">
                  {group.category}
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-4">
                {group.permissions.map((permission) => (
                  <label key={permission} className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center mt-0.5">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer transition-all bg-white dark:bg-gray-700"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors leading-tight">
                      {permission}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 mt-12 pt-6 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors uppercase tracking-widest"
        >
          Discard Changes
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-gray-900 dark:bg-primary-600 text-white text-xs font-black rounded-xl hover:bg-black dark:hover:bg-primary-700 shadow-lg shadow-gray-200 dark:shadow-none transition-all uppercase tracking-[0.2em]"
        >
          {initialData ? 'Update Role Settings' : 'Initialize New Role'}
        </button>
      </div>
    </form>
  );
};

export default RoleForm;
