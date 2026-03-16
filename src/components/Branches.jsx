import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin } from 'lucide-react';
import DataTable from './common/DataTable';
import {
  fetchBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  toggleBranchStatus
} from '../store/branchSlice';
import BranchForm from './BranchForm';
import toast from 'react-hot-toast';

const Branches = () => {
  const branches = useSelector((state) => state.branch.branches || []);
  const dispatch = useDispatch();

  const [view, setView] = useState('list'); // 'list' or 'form'
  const [selectedBranch, setSelectedBranch] = useState(null);

  React.useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const columns = [
    { header: 'Branch Name', key: 'name' },
    { header: 'Code', key: 'code' },
    { header: 'City', key: 'city' },
    { header: 'Email', key: 'email' },
    {
      header: 'Status',
      key: 'is_active',
      render: (isActive, row) => (
        <button
          onClick={() => handleToggleStatus(row.id)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${isActive
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200'
            }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </button>
      )
    },
  ];

  const handleToggleStatus = async (id) => {
    try {
      await dispatch(toggleBranchStatus(id)).unwrap();
      toast.success('Status updated');
    } catch (error) {
      toast.error(error.message || 'Update failed');
    }
  };

  const handleAdd = () => {
    setSelectedBranch(null);
    setView('form');
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setView('form');
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedBranch) {
        await dispatch(updateBranch({ id: selectedBranch.id, data: formData })).unwrap();
        toast.success('Branch updated successfully');
      } else {
        await dispatch(createBranch(formData)).unwrap();
        toast.success('Branch created successfully');
      }
      setView('list');
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await dispatch(deleteBranch(id)).unwrap();
        toast.success('Branch deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Delete failed');
      }
    }
  };

  if (view === 'form') {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">
              {selectedBranch ? 'Edit Branch' : 'Create New Branch'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure branch details and location settings below.
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
        <BranchForm
          onSubmit={handleSubmit}
          initialData={selectedBranch}
          onCancel={() => setView('list')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Branch Management</h1>
        <button
          onClick={handleAdd}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 dark:shadow-none"
        >
          Add New Branch
        </button>
      </div>

      <DataTable
        title="Branches List"
        data={branches}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search branches by name, code or city..."
      />
    </div>
  );
};

export default Branches;
