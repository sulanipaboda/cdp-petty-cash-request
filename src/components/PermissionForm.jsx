// src/components/PermissionForm.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Command, Package, FileText, Save, X } from 'lucide-react';
import logo from '../assets/logo.png';

const PermissionForm = ({ onSubmit, initialData = null, onCancel }) => {
    const [formData, setFormData] = useState({
        module: '',
        action: '',
        description: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="max-w-xl mx-auto py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] shadow-[0_25px_60px_rgba(41,140,119,0.06)] p-10 md:p-14 border border-primary-50"
            >
                {/* Branding Header */}
                <div className="flex justify-center mb-10">
                    <div className="p-3 bg-primary-50 rounded-2xl">
                        <img src={logo} alt="CDP Logo" className="h-10 w-auto object-contain" />
                    </div>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                        {initialData ? 'Refine Logic' : 'Logic Initialization'}
                    </h1>
                    <p className="text-gray-400 mt-2 text-[10px] font-bold uppercase tracking-widest leading-none">
                        Primitive Permission Mapping
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Section 01: Functional Namespace */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-600"></span>
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Functional Namespace</h2>
                        </div>

                        <div className="space-y-10">
                            <div className="relative group">
                                <Package className="absolute left-0 bottom-3 h-5 w-5 text-primary-600" />
                                <input
                                    type="text"
                                    name="module"
                                    value={formData.module}
                                    onChange={handleChange}
                                    placeholder="Target Module Namespace"
                                    className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Command className="absolute left-0 bottom-3 h-5 w-5 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                <input
                                    type="text"
                                    name="action"
                                    value={formData.action}
                                    onChange={handleChange}
                                    placeholder="Authorized Operation / Action"
                                    className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 02: Semantic Definition */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-600"></span>
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Semantic Detail</h2>
                        </div>

                        <div className="relative group">
                            <FileText className="absolute left-0 bottom-3 h-5 w-5 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="1"
                                placeholder="Logic description & security scope..."
                                className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium resize-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-8 flex items-center justify-between gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-[0.2em] transition-colors"
                        >
                            Discard
                        </button>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-primary-600 text-white px-10 py-4.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all flex items-center gap-3"
                        >
                            <Save className="h-4 w-4" />
                            {initialData ? 'Sync Logic' : 'Establish Primitive'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default PermissionForm;
