// src/components/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Activity, Save, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.png';

const UserForm = ({ onSubmit, initialData = null, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        status: 'Active',
    });

    const roles = useSelector((state) => state.user.roles);

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
        <div className="max-w-xl mx-auto py-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(41,140,119,0.06)] p-10 md:p-12 border border-primary-50"
            >
                {/* Branding Header */}
                <div className="flex justify-center mb-8">
                    <div className="p-3 bg-primary-50 rounded-2xl">
                        <img src={logo} alt="CDP Logo" className="h-10 w-auto object-contain" />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                        {initialData ? 'Update Profile' : 'New Identity'}
                    </h1>
                    <p className="text-gray-400 mt-2 text-[10px] font-bold uppercase tracking-widest leading-none">
                        User Management Console
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Section 01: Profile Identity */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-600"></span>
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Identity</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="relative group">
                                <User className="absolute left-0 bottom-3 h-4 w-4 text-primary-600" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Mail className="absolute left-0 bottom-3 h-4 w-4 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                    className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 02: System Access */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary-600"></span>
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Access</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="relative group">
                                <Shield className="absolute left-0 bottom-3 h-4 w-4 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" disabled className="text-gray-400">Select Role</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.name}>{role.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative group">
                                <Activity className="absolute left-0 bottom-3 h-4 w-4 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 flex items-center justify-between gap-4">
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
                            className="bg-primary-600 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all flex items-center gap-3"
                        >
                            <Save className="h-4 w-4" />
                            {initialData ? 'Sync Profile' : 'Create Identity'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UserForm;
