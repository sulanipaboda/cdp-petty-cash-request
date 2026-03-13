import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from './common/DataTable';
import Modal from './common/Modal';
import PermissionForm from './PermissionForm';
import { 
  fetchPermissions, 
  createPermission, 
  updatePermissionAsync, 
  deletePermissionAsync 
} from '../store/userSlice';
import toast from 'react-hot-toast';

const Permissions = () => {
  const permissions = useSelector((state) => state.user.permissions || []);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

  React.useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  const columns = [
    { header: 'Module', key: 'group_name' },
    { header: 'Action', key: 'name' },
  ];

  const handleAdd = () => {
    setSelectedPermission(null);
    setIsModalOpen(true);
  };

  const handleEdit = (permission) => {
    setSelectedPermission(permission);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedPermission) {
        await dispatch(updatePermissionAsync({ id: selectedPermission.id, data: formData })).unwrap();
        toast.success('Permission updated successfully');
      } else {
        await dispatch(createPermission(formData)).unwrap();
        toast.success('Permission added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await dispatch(deletePermissionAsync(id)).unwrap();
        toast.success('Permission deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Delete failed');
      }
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
