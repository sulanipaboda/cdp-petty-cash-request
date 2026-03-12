// src/components/RoleForm.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, FileText, Activity, Layers, Save, CheckSquare, Square } from 'lucide-react';
import logo from '../assets/logo.png';

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
        <div className="max-w-5xl mx-auto py-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(41,140,119,0.06)] p-10 md:p-14 border border-primary-50"
            >
                {/* Branding Header */}
                <div className="flex justify-center mb-10">
                    <div className="p-4 bg-primary-50 rounded-3xl">
                        <img src={logo} alt="CDP Logo" className="h-12 w-auto object-contain" />
                    </div>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                        {initialData ? 'Refine Role' : 'Role Initialization'}
                    </h1>
                    <p className="text-gray-400 mt-3 text-[10px] font-bold uppercase tracking-widest leading-none">
                        Permissions & Access Control Core
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Section 01: Role Blueprint */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-primary-600"></span>
                            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Role Blueprint</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="relative group">
                                <Key className="absolute left-0 bottom-3 h-5 w-5 text-primary-600 transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Role Identifier (Internal)"
                                    className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[15px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Layers className="absolute left-0 bottom-3 h-5 w-5 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                <input
                                    type="text"
                                    name="identityLabel"
                                    value={formData.identityLabel}
                                    onChange={handleChange}
                                    placeholder="Display Label"
                                    className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[15px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 02: Metadata & Status */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-primary-600"></span>
                            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Configuration Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
                            <div className="md:col-span-2 relative group text-left">
                                <FileText className="absolute left-0 bottom-3 h-5 w-5 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="1"
                                    placeholder="Access Scope & Definition..."
                                    className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[15px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium resize-none"
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Activity className="absolute left-0 bottom-3 h-5 w-5 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[15px] font-bold text-gray-900 appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="Active">Operational</option>
                                    <option value="Inactive">Suspended</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 03: Capability Matrix */}
                    <div className="space-y-10 pt-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-primary-600"></span>
                                <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Capability Matrix</h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="flex items-center gap-3 px-4 py-2 bg-primary-50 rounded-xl group transition-all"
                            >
                                <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{isAllSelected ? 'Deselect All' : 'Grant Full Access'}</span>
                                <div className={`p-0.5 rounded transition-all ${isAllSelected ? 'rotate-180' : ''}`}>
                                    {isAllSelected ? <CheckSquare className="h-4 w-4 text-primary-600" /> : <Square className="h-4 w-4 text-primary-600/40 group-hover:text-primary-600" />}
                                </div>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-12">
                            {permissionsData.map((group) => (
                                <div key={group.category} className="space-y-6">
                                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-3 px-2">
                                        <div className="h-1 w-4 bg-primary-600/20 rounded-full" />
                                        {group.category}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {group.permissions.map((permission) => (
                                            <label 
                                                key={permission} 
                                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${formData.permissions.includes(permission) ? 'bg-primary-50/50 border-primary-600 shadow-sm shadow-primary-50' : 'bg-transparent border-gray-50 hover:border-primary-100'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.permissions.includes(permission)}
                                                    onChange={() => handlePermissionChange(permission)}
                                                    className="sr-only"
                                                />
                                                <div className={`h-4 w-4 rounded-md border flex items-center justify-center transition-all ${formData.permissions.includes(permission) ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-200'}`}>
                                                    {formData.permissions.includes(permission) && <CheckSquare className="h-3 w-3 text-white" />}
                                                </div>
                                                <span className={`text-[11px] font-bold tracking-tight ${formData.permissions.includes(permission) ? 'text-gray-900' : 'text-gray-400'}`}>
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
                    <div className="pt-10 flex items-center justify-between border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-[11px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-[0.2em] transition-colors"
                        >
                            Cancel Changes
                        </button>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="bg-primary-600 text-white px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-primary-200 hover:bg-primary-700 transition-all flex items-center gap-3"
                        >
                            <Save className="h-5 w-5" />
                            {initialData ? 'Synchronize' : 'Authorize Role'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RoleForm;
