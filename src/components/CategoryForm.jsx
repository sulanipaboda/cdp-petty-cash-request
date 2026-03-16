// src/components/CategoryForm.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, FileText, Save, Activity } from 'lucide-react';

const CategoryForm = ({ onSubmit, initialData = null, onCancel }) => {
    const isEditing = !!initialData;

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden"
            >
                {/* Hero Header */}
                <div className="relative bg-primary-600 px-6 py-6 overflow-hidden">
                    <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10">
                        <Tag className="h-40 w-40 text-white" />
                    </div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
                            <Tag className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white uppercase tracking-tighter leading-none">
                                {isEditing ? 'Update Classification' : 'New Category'}
                            </h1>
                            <p className="text-primary-100 mt-1 text-[9px] font-medium opacity-80 uppercase tracking-widest leading-none">
                                Expense Categorization Engine
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Section 01: Category Blueprint */}
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-2xl font-black text-gray-100 dark:text-gray-800 tracking-tighter">01</span>
                            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                            <h2 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Category Blueprint</h2>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Category Name</label>
                                <div className="relative group">
                                    <Tag className="absolute left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Office Supplies"
                                        className="w-full pl-12 pr-6 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-xl outline-none transition-all text-[12px] font-bold text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Description</label>
                                <div className="relative group">
                                    <FileText className="absolute left-5 top-6 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Enter detailed category description..."
                                        className="w-full pl-12 pr-6 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-xl outline-none transition-all text-[12px] font-bold text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-5">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-[9px] font-black text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 uppercase tracking-[0.2em] transition-colors"
                        >
                            Discard
                        </button>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02, translateY: -1 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all flex items-center gap-2"
                        >
                            <Save className="h-3.5 w-3.5" />
                            {isEditing ? 'Sync' : 'Create'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CategoryForm;
