import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from './common/DataTable';
import Modal from './common/Modal';
import PermissionForm from './PermissionForm';
import Spinner from './common/Spinner';
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

  const handleEdit = (permission) => {
    setSelectedPermission(permission);
    setIsModalOpen(true);
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
      </div>

      {useSelector(state => state.user.dataStatus) === 'loading' ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <DataTable 
          title="Permissions List"
          data={permissions}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search by module or action..."
        />
      )}
    </div>
  );
};

export default Permissions;
