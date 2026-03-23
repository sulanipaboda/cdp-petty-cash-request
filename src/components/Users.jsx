import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from './common/DataTable';
import Modal from './common/Modal';
import UserForm from './UserForm';
import { 
  fetchUsers, 
  createUser, 
  updateUserAsync, 
  deleteUserAsync,
  toggleUserStatus 
} from '../store/userSlice';
import toast from 'react-hot-toast';

const Users = () => {
  const users = useSelector((state) => state.user.users || []);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  React.useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { 
      header: 'Role', 
      key: 'roles',
      render: (roles) => roles && roles.length > 0 ? roles[0].name : 'No Role'
    },
    { 
      header: 'Status', 
      key: 'is_active',
      render: (isActive) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          isActive 
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { 
      header: 'Joined Date', 
      key: 'created_at',
      render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A'
    },
  ];

  const handleAdd = () => {
    setSelectedUser(null);
    setIsReadOnly(false);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsReadOnly(false);
    setIsModalOpen(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsReadOnly(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedUser) {
        await dispatch(updateUserAsync({ id: selectedUser.id, data: formData })).unwrap();
        toast.success('User updated successfully');
      } else {
        await dispatch(createUser({ ...formData, createdAt: new Date().toISOString().split('T')[0] })).unwrap();
        toast.success('User added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dispatch(deleteUserAsync(id)).unwrap();
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Delete failed');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await dispatch(toggleUserStatus(id)).unwrap();
      toast.success('User status updated');
    } catch (error) {
      toast.error(error.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">User Management</h1>
        <button 
          onClick={handleAdd}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 dark:shadow-none"
        >
          Add New User
        </button>
      </div>

      <DataTable 
        title="Users List"
        data={users}
        columns={columns}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        searchPlaceholder="Search by name, email or role..."
      />


      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isReadOnly ? 'User Details' : selectedUser ? 'Edit User' : 'Add New User'}
      >
        <UserForm
          onSubmit={handleSubmit}
          initialData={selectedUser}
          isReadOnly={isReadOnly}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Users;
