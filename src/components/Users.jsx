import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from './common/DataTable';
import Modal from './common/Modal';
import UserForm from './UserForm';
import { addUser, updateUser, deleteUser } from '../store/userSlice';
import toast from 'react-hot-toast';

const Users = () => {
  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Role', key: 'role' },
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
    { header: 'Joined Date', key: 'createdAt' },
  ];

  const handleAdd = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (selectedUser) {
      dispatch(updateUser(formData));
      toast.success('User updated successfully');
    } else {
      dispatch(addUser({ ...formData, createdAt: new Date().toISOString().split('T')[0] }));
      toast.success('User added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
      toast.success('User deleted successfully');
    }
  };

  const handleView = (user) => {
    toast.success(`Viewing details for ${user.name}`);
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
        title={selectedUser ? 'Edit User' : 'Add New User'}
      >
        <UserForm
          onSubmit={handleSubmit}
          initialData={selectedUser}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Users;
