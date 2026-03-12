// src/components/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, Activity, Save, X } from 'lucide-react';
import { useSelector } from 'react-redux';

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
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
                {/* Hero Header */}
                <div className="relative bg-primary-600 px-6 py-6 overflow-hidden">
                    <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10">
                        <User className="h-40 w-40 text-white" />
                    </div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white uppercase tracking-tighter leading-none">
                                {initialData ? 'Update Profile' : 'New Identity'}
                            </h1>
                            <p className="text-primary-100 mt-1 text-[9px] font-medium opacity-80 uppercase tracking-widest leading-none">
                                User Management Console
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Section 01: Profile Identity */}
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-2xl font-black text-gray-100 dark:text-gray-800 tracking-tighter">01</span>
                            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                            <h2 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Profile Identity</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className="w-full pl-12 pr-6 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-xl outline-none transition-all text-[12px] font-bold text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="w-full pl-12 pr-6 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-xl outline-none transition-all text-[12px] font-bold text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 02: System Access */}
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-2xl font-black text-gray-100 dark:text-gray-800 tracking-tighter">02</span>
                            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                            <h2 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">System Access</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Assign Role</label>
                                <div className="relative group">
                                    <Shield className="absolute left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-xl outline-none transition-all text-[12px] font-bold text-gray-900 dark:text-gray-100 appearance-none"
                                        required
                                    >
                                        <option value="">Select Scale</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.name}>{role.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Operational Status</label>
                                <div className="relative group">
                                    <Activity className="absolute left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-xl outline-none transition-all text-[12px] font-bold text-gray-900 dark:text-gray-100 appearance-none"
                                        required
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
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
                            {initialData ? 'Sync' : 'Create'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UserForm;
