// src/components/Departments.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Building2 } from 'lucide-react';
import DataTable from './common/DataTable';
import Modal from './common/Modal';
import { 
  fetchDepartments, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment, 
  toggleDepartmentStatus 
} from '../store/departmentSlice';
import DepartmentForm from './DepartmentForm';
import toast from 'react-hot-toast';

const Departments = () => {
  const departments = useSelector((state) => state.department.departments || []);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  React.useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const columns = [
    { header: 'Department Name', key: 'name' },
    { header: 'Code', key: 'code' },
    { header: 'Head', key: 'department_head_name' },
    { header: 'Email', key: 'department_head_email' },
    { 
      header: 'Status', 
      key: 'is_active',
      render: (isActive, row) => (
        <button
          onClick={() => handleToggleStatus(row.id)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
            isActive 
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
      await dispatch(toggleDepartmentStatus(id)).unwrap();
      toast.success('Status updated');
    } catch (error) {
      toast.error(error.message || 'Update failed');
    }
  };

  const handleAdd = () => {
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedDepartment) {
        await dispatch(updateDepartment({ id: selectedDepartment.id, data: formData })).unwrap();
        toast.success('Department updated successfully');
      } else {
        await dispatch(createDepartment(formData)).unwrap();
        toast.success('Department created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await dispatch(deleteDepartment(id)).unwrap();
        toast.success('Department deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Department Management</h1>
        <button 
          onClick={handleAdd}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 dark:shadow-none"
        >
          Add New Department
        </button>
      </div>

      <DataTable 
        title="Departments List"
        data={departments}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search departments by name, code or head..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDepartment ? 'Edit Department' : 'Add New Department'}
      >
        <DepartmentForm
          onSubmit={handleSubmit}
          initialData={selectedDepartment}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Departments;
