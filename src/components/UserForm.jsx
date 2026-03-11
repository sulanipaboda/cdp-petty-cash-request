// src/components/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const UserForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active',
  });

  const roles = useSelector((state) => state.user.roles);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Full Name</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Email Address</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. john@cdp.com"
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Role</label>
          <select
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          >
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role.id} value={role.name}>{role.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Status</label>
          <select
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors uppercase tracking-tight"
        >
          Discard
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-200 dark:shadow-none transition-all uppercase tracking-tight"
        >
          {initialData ? 'Update User Settings' : 'Create New User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
