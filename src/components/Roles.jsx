import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from './common/DataTable';
import Modal from './common/Modal';
import RoleForm from './RoleForm';
import { addRole, updateRole, deleteRole } from '../store/userSlice';
import toast from 'react-hot-toast';

const Roles = () => {
  const roles = useSelector((state) => state.user.roles);
  const dispatch = useDispatch();

  const [view, setView] = useState('list'); // 'list' or 'form'
  const [selectedRole, setSelectedRole] = useState(null);

  const columns = [
    { header: 'Role Name', key: 'name' },
    { header: 'Description', key: 'description' },
    { header: 'User Count', key: 'userCount' },
    { 
      header: 'Status', 
      key: 'status',
      render: (status) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          status === 'Active' 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
        }`}>
          {status}
        </span>
      )
    },
  ];

  const handleAdd = () => {
    setSelectedRole(null);
    setView('form');
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setView('form');
  };

  const handleSubmit = (formData) => {
    if (selectedRole) {
      dispatch(updateRole(formData));
      toast.success('Role updated successfully');
    } else {
      dispatch(addRole({ ...formData, userCount: 0 }));
      toast.success('Role added successfully');
    }
    setView('list');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      dispatch(deleteRole(id));
      toast.success('Role deleted successfully');
    }
  };

  if (view === 'form') {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
              {selectedRole ? 'Edit Role' : 'Create New Role'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure role permissions and identity settings below.
            </p>
          </div>
          <button
            onClick={() => setView('list')}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <RoleForm
          onSubmit={handleSubmit}
          initialData={selectedRole}
          onCancel={() => setView('list')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Role Management</h1>
        <button 
          onClick={handleAdd}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 dark:shadow-none"
        >
          Add New Role
        </button>
      </div>

      <DataTable 
        title="Roles List"
        data={roles}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search by role name or description..."
      />
    </div>
  );
};

export default Roles;
