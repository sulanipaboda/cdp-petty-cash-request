import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from './common/DataTable';
import Modal from './common/Modal';
import PermissionForm from './PermissionForm';
import { addPermission, updatePermission, deletePermission } from '../store/userSlice';
import toast from 'react-hot-toast';

const Permissions = () => {
  const permissions = useSelector((state) => state.user.permissions);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

  const columns = [
    { header: 'Module', key: 'module' },
    { header: 'Action', key: 'action' },
    { header: 'Description', key: 'description' },
  ];

  const handleAdd = () => {
    setSelectedPermission(null);
    setIsModalOpen(true);
  };

  const handleEdit = (permission) => {
    setSelectedPermission(permission);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (selectedPermission) {
      dispatch(updatePermission(formData));
      toast.success('Permission updated successfully');
    } else {
      dispatch(addPermission(formData));
      toast.success('Permission added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      dispatch(deletePermission(id));
      toast.success('Permission deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Permission Management</h1>
        <button 
          onClick={handleAdd}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 dark:shadow-none"
        >
          Add New Permission
        </button>
      </div>

      <DataTable 
        title="Permissions List"
        data={permissions}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search by module or action..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPermission ? 'Edit Permission' : 'Add New Permission'}
      >
        <PermissionForm
          onSubmit={handleSubmit}
          initialData={selectedPermission}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Permissions;
