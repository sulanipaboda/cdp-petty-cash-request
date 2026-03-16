// src/components/Categories.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tag } from 'lucide-react';
import DataTable from './common/DataTable';
import Modal from './common/Modal';
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../store/categorySlice';
import CategoryForm from './CategoryForm';
import toast from 'react-hot-toast';

const Categories = () => {
  const categories = useSelector((state) => state.category.categories || []);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  React.useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const columns = [
    { header: 'Category Name', key: 'name' },
    { header: 'Slug', key: 'slug' },
    { header: 'Description', key: 'description' },
  ];

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedCategory) {
        await dispatch(updateCategory({ id: selectedCategory.id, data: formData })).unwrap();
        toast.success('Category updated successfully');
      } else {
        await dispatch(createCategory(formData)).unwrap();
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Category Management</h1>
        <button 
          onClick={handleAdd}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 dark:shadow-none"
        >
          Add New Category
        </button>
      </div>

      <DataTable 
        title="Categories List"
        data={categories}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search categories by name or description..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? 'Edit Category' : 'Add New Category'}
      >
        <CategoryForm
          onSubmit={handleSubmit}
          initialData={selectedCategory}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Categories;
