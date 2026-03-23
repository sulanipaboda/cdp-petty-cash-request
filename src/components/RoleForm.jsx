// src/components/RoleForm.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Shield, Key, Activity, Save, CheckSquare, Square } from 'lucide-react';

const RoleForm = ({ onSubmit, initialData = null, onCancel, isReadOnly = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissions: []  // Array of permission IDs (what backend expects)
    });

    // Load permissions from Redux store (fetched from backend)
    const allPermissions = useSelector((state) => state.user.permissions || []);

    // Group permissions by group_name for display
    const groupedPermissions = allPermissions.reduce((groups, perm) => {
        const group = perm.group_name || 'General';
        if (!groups[group]) groups[group] = [];
        groups[group].push(perm);
        return groups;
    }, {});

    useEffect(() => {
        if (initialData) {
            // Extract permission IDs from the nested permissions array
            const permissionIds = Array.isArray(initialData.permissions)
                ? initialData.permissions.map(p => typeof p === 'object' ? p.id : p)
                : [];

            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                permissions: permissionIds
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (permId) => {
        setFormData(prev => {
            const newPermissions = prev.permissions.includes(permId)
                ? prev.permissions.filter(id => id !== permId)
                : [...prev.permissions, permId];
            return { ...prev, permissions: newPermissions };
        });
    };

    const allPermissionIds = allPermissions.map(p => p.id);
    const isAllSelected = allPermissionIds.length > 0 && formData.permissions.length === allPermissionIds.length;

    const handleSelectAll = () => {
        if (isReadOnly) return;
        if (isAllSelected) {
            setFormData(prev => ({ ...prev, permissions: [] }));
        } else {
            setFormData(prev => ({ ...prev, permissions: allPermissionIds }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit with permission IDs as backend expects
        onSubmit(formData);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
                {/* Hero Header */}
                <div className="relative bg-primary-600 px-6 py-6 overflow-hidden">
                    <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10">
                        <Shield className="h-40 w-40 text-white" />
                    </div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white uppercase tracking-tighter leading-none">
                                {isReadOnly ? 'View Role' : (initialData ? 'Refine Role' : 'Role Initialization')}
                            </h1>
                            <p className="text-primary-50 mt-1 text-[9px] font-medium opacity-80 uppercase tracking-widest leading-none">
                                {isReadOnly ? 'View Mode' : 'Permissions & Access Control'}
                            </p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Section 01: Role Blueprint */}
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-2xl font-black text-gray-100 dark:text-gray-800 tracking-tighter">01</span>
                            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                            <h2 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Role Blueprint</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Role Name</label>
                                <div className="relative group">
                                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Role Name"
                                        className={`w-full pl-12 pr-6 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary-600/20 focus:bg-white dark:focus:bg-gray-800 rounded-xl outline-none transition-all text-[12px] font-bold text-gray-900 dark:text-gray-100 ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        required
                                        disabled={isReadOnly}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">
                                    Description <span className="text-gray-300 dark:text-gray-600 normal-case font-normal">(optional)</span>
                                </label>
                                <div className="relative group">
                                    <Activity className="absolute left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Role description..."
                                        className={`w-full pl-12 pr-6 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary-600/20 focus:bg-white dark:focus:bg-gray-800 rounded-xl outline-none transition-all text-[12px] font-bold text-gray-900 dark:text-gray-100 ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        disabled={isReadOnly}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 02: Capability Matrix */}
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-2xl font-black text-gray-100 dark:text-gray-800 tracking-tighter">02</span>
                            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                            <h2 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Capability Matrix</h2>
                        </div>

                        <div className="flex items-center justify-between mb-5 px-1">
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary-600"></div>
                                <span className="text-[9px] font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    Access Controls
                                    <span className="ml-2 text-primary-600 font-bold">({formData.permissions.length}/{allPermissionIds.length})</span>
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="flex items-center gap-2 group"
                            >
                                <span className={`text-[8px] font-black group-hover:text-primary-600 uppercase tracking-widest transition-colors ${isReadOnly ? 'text-gray-300 pointer-events-none' : 'text-gray-400'}`}>Select All</span>
                                <div className={`p-0.5 rounded transition-colors ${isAllSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                    {isAllSelected ? <CheckSquare className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                                </div>
                            </button>
                        </div>

                        {allPermissions.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-[11px] font-medium">
                                Loading permissions...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8">
                                {Object.entries(groupedPermissions).map(([group, perms]) => (
                                    <div key={group} className="space-y-4">
                                        <h3 className="text-[9px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <span className="h-1 w-1 rounded-full bg-primary-600"></span>
                                            {group}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                            {perms.map((perm) => (
                                                <label
                                                    key={perm.id}
                                                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all duration-300 ${formData.permissions.includes(perm.id) ? 'bg-primary-50/30 dark:bg-primary-900/10 border-primary-600/20' : 'bg-transparent border-gray-50 dark:border-gray-800/50 hover:border-primary-600/10'}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.permissions.includes(perm.id)}
                                                        onChange={() => !isReadOnly && handlePermissionChange(perm.id)}
                                                        className="sr-only"
                                                        disabled={isReadOnly}
                                                    />
                                                    <div className={`p-1 rounded transition-all flex-shrink-0 ${formData.permissions.includes(perm.id) ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-transparent'}`}>
                                                        <CheckSquare className="h-2.5 w-2.5" />
                                                    </div>
                                                    <span className={`text-[9px] font-bold tracking-tight transition-colors ${formData.permissions.includes(perm.id) ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                        {perm.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-5">
                        <button
                            type="button"
                            onClick={onCancel}
                            className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 px-6 py-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700' : 'text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'}`}
                        >
                            {isReadOnly ? 'Close' : 'Cancel'}
                        </button>
                        {!isReadOnly && (
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02, translateY: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all flex items-center gap-2"
                            >
                                <Save className="h-3.5 w-3.5" />
                                {initialData ? 'Sync' : 'Initialize'}
                            </motion.button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RoleForm;
