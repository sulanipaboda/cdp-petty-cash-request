// src/components/PermissionForm.jsx
import React, { useState, useEffect } from 'react';

const PermissionForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    module: '',
    action: '',
    description: '',
  });

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
    <form onSubmit={handleSubmit} className="space-y-6 transition-colors duration-300">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Module</label>
          <input
            type="text"
            name="module"
            required
            value={formData.module}
            onChange={handleChange}
            placeholder="e.g. Requests"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Action</label>
          <input
            type="text"
            name="action"
            required
            value={formData.action}
            onChange={handleChange}
            placeholder="e.g. Approve"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">Description</label>
        <textarea
          name="description"
          required
          rows="3"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what this permission allows..."
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
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
          {initialData ? 'Update Permission' : 'Create Permission'}
        </button>
      </div>
    </form>
  );
};

export default PermissionForm;
