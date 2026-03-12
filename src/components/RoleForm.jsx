// src/components/RoleForm.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, FileText, Activity, Layers, Save, CheckSquare, Square } from 'lucide-react';

const permissionsData = [
    {
        category: 'Access Management Permissions',
        permissions: ['Permission Create', 'Permission Delete', 'Permission Index', 'Permission Update', 'Role Create', 'Role Delete', 'Role Index', 'Role Update']
    },
    {
        category: 'Branch Management Permissions',
        permissions: ['Branch Create', 'Branch Delete', 'Branch Index', 'Branch Toggle Status', 'Branch Update']
    },
    {
        category: 'Country Management Permissions',
        permissions: ['Country Create', 'Country Delete', 'Country Index', 'Country Toggle Status', 'Country Update']
    },
    {
        category: 'Customer Management Permissions',
        permissions: ['Customer Create', 'Customer Delete', 'Customer Force Delete', 'Customer Index', 'Customer Restore', 'Customer Toggle Status', 'Customer Update']
    },
    {
        category: 'Dashboard Management Permissions',
        permissions: ['Dashboard View']
    },
    {
        category: 'Investment Management Permissions',
        permissions: ['Investment Approve', 'Investment Certificate', 'Investment Create', 'Investment Delete', 'Investment Index', 'Investment Update']
    },
    {
        category: 'Investment Product Permissions',
        permissions: ['Investment Product Create', 'Investment Product Delete', 'Investment Product Index', 'Investment Product Toggle Status', 'Investment Product Update']
    },
    {
        category: 'Level Management Permissions',
        permissions: ['Level Create', 'Level Delete', 'Level Index', 'Level Update']
    },
    {
        category: 'Province Management Permissions',
        permissions: ['Province Create', 'Province Delete', 'Province Index', 'Province Toggle Status', 'Province Update']
    },
    {
        category: 'Quotation Management Permissions',
        permissions: ['Quotation Create', 'Quotation Delete', 'Quotation Force Delete', 'Quotation Index', 'Quotation Restore', 'Quotation Toggle Status', 'Quotation Update']
    },
    {
        category: 'Receipt Management Permissions',
        permissions: ['Receipt Create', 'Receipt Index']
    },
    {
        category: 'Region Management Permissions',
        permissions: ['Region Create', 'Region Delete', 'Region Index', 'Region Toggle Status', 'Region Update']
    },
    {
        category: 'Report Management Permissions',
        permissions: ['Report Index']
    },
    {
        category: 'Target Management Permissions',
        permissions: ['My Targets', 'Target Create', 'Target Delete', 'Target Index', 'Target Update']
    },
    {
        category: 'Target Progress Permissions',
        permissions: ['Target Progress Index']
    },
    {
        category: 'User Management Permissions',
        permissions: ['User Create', 'User Delete', 'User Index', 'User Toggle Status', 'User Update']
    },
    {
        category: 'Zone Management Permissions',
        permissions: ['Zone Create', 'Zone Delete', 'Zone Index', 'Zone Toggle Status', 'Zone Update']
    }
];

const RoleForm = ({ onSubmit, initialData = null, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        identityLabel: '',
        description: '',
        status: 'Active',
        permissions: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                permissions: initialData.permissions || []
            }));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (permission) => {
        setFormData(prev => {
            const newPermissions = prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission];
            return { ...prev, permissions: newPermissions };
        });
    };

    const allPermissionNames = permissionsData.flatMap(p => p.permissions);
    const isAllSelected = formData.permissions.length === allPermissionNames.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setFormData(prev => ({ ...prev, permissions: [] }));
        } else {
            setFormData(prev => ({ ...prev, permissions: allPermissionNames }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
                <div className="relative bg-gray-900 dark:bg-gray-800 px-6 py-6 overflow-hidden">
                    <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10">
                        <Shield className="h-40 w-40 text-white" />
                    </div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white uppercase tracking-tighter leading-none">
                                {initialData ? 'Refine Role' : 'Role Initialization'}
                            </h1>
                            <p className="text-gray-400 mt-1 text-[9px] font-medium opacity-80 uppercase tracking-widest leading-none">
                                Permissions & Access Control
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
                                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Role Name"
                                        className="w-full pl-12 pr-6 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-xl outline-none transition-all text-[12px] font-bold text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Identity Label</label>
                                <div className="relative group">
                                    <Layers className="absolute left-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="identityLabel"
                                        value={formData.identityLabel}
                                        onChange={handleChange}
                                        placeholder="Identity Label"
                                        className="w-full pl-12 pr-6 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-xl outline-none transition-all text-[12px] font-bold text-gray-900 dark:text-gray-100"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 02: Description & Status */}
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-2xl font-black text-gray-100 dark:text-gray-800 tracking-tighter">02</span>
                            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                            <h2 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Metadata & Status</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Description</label>
                                <div className="relative group">
                                    <FileText className="absolute left-5 top-4 h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="1"
                                        placeholder="Role scope..."
                                        className="w-full pl-12 pr-6 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white dark:focus:bg-gray-800 rounded-xl outline-none transition-all text-[12px] font-bold text-gray-900 dark:text-gray-100 resize-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Status</label>
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

                    {/* Section 03: Capability Matrix */}
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-2xl font-black text-gray-100 dark:text-gray-800 tracking-tighter">03</span>
                            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                            <h2 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Capability Matrix</h2>
                        </div>

                        <div className="flex items-center justify-between mb-5 px-1">
                             <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary-500"></div>
                                <span className="text-[9px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Access Controls</span>
                             </div>
                             <button
                                type="button"
                                onClick={handleSelectAll}
                                className="flex items-center gap-2 group"
                             >
                                <span className="text-[8px] font-black text-gray-400 group-hover:text-primary-500 uppercase tracking-widest transition-colors">Select All</span>
                                <div className={`p-0.5 rounded transition-colors ${isAllSelected ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                    {isAllSelected ? <CheckSquare className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                                </div>
                             </button>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {permissionsData.map((group) => (
                                <div key={group.category} className="space-y-4">
                                    <h3 className="text-[9px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <span className="h-1 w-1 rounded-full bg-primary-500"></span>
                                        {group.category}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {group.permissions.map((permission) => (
                                            <label 
                                                key={permission} 
                                                className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all duration-300 ${formData.permissions.includes(permission) ? 'bg-primary-50/30 dark:bg-primary-900/10 border-primary-500/20' : 'bg-transparent border-gray-50 dark:border-gray-800/50 hover:border-primary-500/10'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.permissions.includes(permission)}
                                                    onChange={() => handlePermissionChange(permission)}
                                                    className="sr-only"
                                                />
                                                <div className={`p-1 rounded transition-all ${formData.permissions.includes(permission) ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-transparent'}`}>
                                                    <CheckSquare className="h-2.5 w-2.5" />
                                                </div>
                                                <span className={`text-[9px] font-bold tracking-tight transition-colors ${formData.permissions.includes(permission) ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                    {permission}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-5">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-[9px] font-black text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 uppercase tracking-[0.2em] transition-colors"
                        >
                            Cancel
                        </button>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02, translateY: -1 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all flex items-center gap-2"
                        >
                            <Save className="h-3.5 w-3.5" />
                            {initialData ? 'Sync' : 'Initialize'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RoleForm;
