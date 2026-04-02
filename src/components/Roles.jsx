import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from './common/DataTable';
import Modal from './common/Modal';
import RoleForm from './RoleForm';
import Spinner from './common/Spinner';
import { 
  fetchRoles, 
  createRole, 
  updateRoleAsync, 
  deleteRoleAsync 
} from '../store/userSlice';
import toast from 'react-hot-toast';

const Roles = () => {
  const roles = useSelector((state) => state.user.roles || []);
  const dispatch = useDispatch();

  const [view, setView] = useState('list'); // 'list' or 'form'
  const [selectedRole, setSelectedRole] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  React.useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const columns = [
    { header: 'Role Name', key: 'name' },
  ];

  const handleAdd = () => {
    setSelectedRole(null);
    setIsReadOnly(false);
    setView('form');
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsReadOnly(false);
    setView('form');
  };

  const handleView = (role) => {
    setSelectedRole(role);
    setIsReadOnly(true);
    setView('form');
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedRole) {
        await dispatch(updateRoleAsync({ id: selectedRole.id, data: formData })).unwrap();
        toast.success('Role updated successfully');
      } else {
        await dispatch(createRole({ ...formData, userCount: 0 })).unwrap();
        toast.success('Role added successfully');
      }
      setView('list');
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await dispatch(deleteRoleAsync(id)).unwrap();
        toast.success('Role deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Delete failed');
      }
    }
  };

  if (view === 'form') {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800 text-primary-600">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
              {isReadOnly ? 'View Role' : (selectedRole ? 'Edit Role' : 'Create New Role')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isReadOnly ? 'View Mode' : 'Configure role permissions and identity settings below.'}
            </p>
          </div>
          <button
            onClick={() => setView('list')}
            className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-all"
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
          isReadOnly={isReadOnly}
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
          className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 dark:shadow-none"
        >
          Add New Role
        </button>
      </div>

      {useSelector(state => state.user.dataStatus) === 'loading' ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <DataTable 
          title="Roles List"
          data={roles}
          columns={columns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search by role name or description..."
        />
      )}
    </div>
  );
};

export default Roles;
