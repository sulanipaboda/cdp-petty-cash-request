// src/components/PettyCashForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, MapPin, Package, FileText, Send, Upload, DollarSign, X, CheckCircle, ShieldCheck, Hash, Briefcase, Layers, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addRequest } from '../store/pettyCashSlice';
import logo from '../assets/logo.png';

const PettyCashForm = () => {
    const dispatch = useDispatch();
    const { categories, requests } = useSelector(state => state.pettyCash);
    const { users, currentUser } = useSelector(state => state.user);
    const isAdmin = currentUser?.role === 'System Administrator' || currentUser?.role === 'Finance Manager';

    const [formData, setFormData] = useState({
        referenceNumber: '',
        fullName: currentUser?.name || '',
        branchLocation: '',
        department: '',
        dateNeeded: '',
        category: '',
        description: '',
        requestType: 'New Purchase',
        amount: '',
        status: 'pending',
        paymentStatus: 'pending',
        approvedBy: '',
        receiptFile: null,
        receiptFileName: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please upload only JPG, PNG, or PDF files');
                return;
            }
            setFormData(prev => ({
                ...prev,
                receiptFile: file,
                receiptFileName: file.name
            }));
        }
    };

    const removeFile = () => {
        setFormData(prev => ({ ...prev, receiptFile: null, receiptFileName: '' }));
        document.getElementById('receipt-upload').value = '';
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleDateChange = (e, fieldName) => {
        setFormData(prev => ({ ...prev, [fieldName]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.referenceNumber || !formData.fullName || !formData.branchLocation ||
            !formData.dateNeeded || !formData.category || !formData.amount) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Uniqueness check for Reference Number
        const isRefUnique = !requests.some(req => req.referenceNumber === formData.referenceNumber);
        if (!isRefUnique) {
            toast.error('Reference Number must be unique');
            return;
        }

        if (formData.requestType === 'Reimbursement' && !formData.receiptFile) {
            toast.error('Please upload a receipt for reimbursement');
            return;
        }

        const newRequest = {
            id: Date.now().toString(),
            ...formData,
            amount: parseFloat(formData.amount),
            submittedAt: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0], // Internal date format
        };
        delete newRequest.receiptFile;

        dispatch(addRequest(newRequest));
        toast.success('Submitted Successfully');
        setFormData({
            referenceNumber: '',
            fullName: currentUser?.name || '',
            branchLocation: '',
            department: '',
            dateNeeded: '',
            category: '',
            description: '',
            requestType: 'New Purchase',
            amount: '',
            status: 'pending',
            paymentStatus: 'pending',
            approvedBy: '',
            receiptFile: null,
            receiptFileName: '',
        });
    };

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-4 relative overflow-hidden">
            {/* Abstract Background Elements (Matching Login) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -right-20 w-[700px] h-[700px] bg-primary-600 rounded-full blur-[140px] opacity-10"
                />
                <motion.div
                    animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-40 -left-40 w-[800px] h-[800px] bg-primary-600 rounded-full blur-[120px] opacity-15"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[620px] relative z-10 my-8"
            >
                <div className="bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(41,140,119,0.08)] p-10 md:p-14 border border-primary-50">
                    {/* Branding Logo */}
                    <div className="flex justify-center mb-10">
                        <div className="p-4 bg-primary-50 rounded-3xl">
                            <img src={logo} alt="CDP Logo" className="h-12 w-auto object-contain" />
                        </div>
                    </div>

                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-3">
                            <span className="text-primary-600">Requisition</span> Portal
                        </h1>
                        <p className="text-gray-400 mt-3 text-[12px] font-bold uppercase tracking-[0.2em] leading-none">Petty Cash Management System</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Section 1: Identification */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identification</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="relative group">
                                    <Hash className="absolute left-0 bottom-3 h-5 w-5 text-primary-600" />
                                    <input
                                        type="text"
                                        name="referenceNumber"
                                        value={formData.referenceNumber}
                                        onChange={handleChange}
                                        placeholder="Reference Number (Unique)"
                                        className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <User className="absolute left-0 bottom-3 h-5 w-5 text-primary-600" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Location & Department */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location & Department</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="relative group">
                                    <MapPin className="absolute left-0 bottom-3 h-5 w-5 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                    <input
                                        type="text"
                                        name="branchLocation"
                                        value={formData.branchLocation}
                                        onChange={handleChange}
                                        placeholder="Branch / Location"
                                        className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <Briefcase className="absolute left-0 bottom-3 h-5 w-5 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="Department (Optional)"
                                        className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Timeline & Category */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Specifications</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="relative group">
                                    <Calendar className="absolute left-0 bottom-3 h-5 w-5 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                    <label className="absolute left-8 top-[-18px] text-[9px] font-black text-primary-600/50 uppercase tracking-widest">Funds Required By</label>
                                    <input
                                        type="date"
                                        name="dateNeeded"
                                        value={formData.dateNeeded}
                                        onChange={(e) => handleDateChange(e, 'dateNeeded')}
                                        className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <Layers className="absolute left-0 bottom-3 h-5 w-5 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="" disabled className="text-gray-300">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id} className="text-gray-900">{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Request Type & Description */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Request Nature</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`relative flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${formData.requestType === 'New Purchase' ? 'bg-primary-50/50 border-primary-600 shadow-sm shadow-primary-100' : 'bg-transparent border-gray-100 hover:border-primary-200'}`}>
                                    <input type="radio" name="requestType" value="New Purchase" checked={formData.requestType === 'New Purchase'} onChange={handleChange} className="sr-only" />
                                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.requestType === 'New Purchase' ? 'border-primary-600' : 'border-gray-200'}`}>
                                        {formData.requestType === 'New Purchase' && <div className="h-2 w-2 rounded-full bg-primary-600" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-black text-gray-900 tracking-tight leading-none mb-1">New Purchase</span>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none">Standard Expenditure</span>
                                    </div>
                                </label>
                                <label className={`relative flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${formData.requestType === 'Reimbursement' ? 'bg-primary-50/50 border-primary-600 shadow-sm shadow-primary-100' : 'bg-transparent border-gray-100 hover:border-primary-200'}`}>
                                    <input type="radio" name="requestType" value="Reimbursement" checked={formData.requestType === 'Reimbursement'} onChange={handleChange} className="sr-only" />
                                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.requestType === 'Reimbursement' ? 'border-primary-600' : 'border-gray-200'}`}>
                                        {formData.requestType === 'Reimbursement' && <div className="h-2 w-2 rounded-full bg-primary-600" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-black text-gray-900 tracking-tight leading-none mb-1">Reimbursement</span>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none">Past Expenditure</span>
                                    </div>
                                </label>
                            </div>

                            <div className="relative group">
                                <FileText className="absolute left-0 top-3 h-5 w-5 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Brief Description of Expenditure (Optional)"
                                    rows="1"
                                    className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium resize-none overflow-hidden"
                                />
                            </div>
                        </div>

                        {/* Section 5: Finance & Approval */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Financial & Control</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="relative group">
                                    <DollarSign className="absolute left-0 bottom-3 h-5 w-5 text-primary-600" />
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="Value (LKR)"
                                        step="0.01"
                                        className="w-full pl-10 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-black text-gray-900 placeholder:text-gray-300"
                                        required
                                    />
                                    <span className="absolute right-0 bottom-3 text-[10px] font-black text-primary-600/50 uppercase tracking-widest">LKR</span>
                                </div>

                                {isAdmin && (
                                    <div className="relative group">
                                        <UserCheck className="absolute left-0 bottom-3 h-5 w-5 text-gray-200 group-focus-within:text-primary-600 transition-colors" />
                                        <select
                                            name="approvedBy"
                                            value={formData.approvedBy}
                                            onChange={handleChange}
                                            className="w-full pl-8 pb-3 bg-transparent border-b border-gray-100 focus:border-primary-600 outline-none transition-all text-[14px] font-bold text-gray-900 appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled className="text-gray-300">Approver (Admin Only)</option>
                                            {users.filter(u => u.role === 'System Administrator' || u.role === 'Finance Manager').map(user => (
                                                <option key={user.id} value={user.id} className="text-gray-900">{user.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <AnimatePresence mode="wait">
                                    {!formData.receiptFile ? (
                                        <motion.div
                                            key="upload"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="relative h-full flex items-end"
                                        >
                                            <label className="flex items-center gap-3 w-full pb-3 border-b border-gray-100 cursor-pointer group">
                                                <Upload className="h-5 w-5 text-gray-200 group-hover:text-primary-600 transition-colors" />
                                                <span className="text-[14px] font-bold text-gray-300 group-hover:text-primary-600 transition-colors uppercase tracking-tight">Attach Evidence (Optional)</span>
                                                <input id="receipt-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" />
                                            </label>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="file"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="flex items-center justify-between gap-3 pb-3 border-b border-primary-600"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <CheckCircle className="h-5 w-5 text-primary-600" />
                                                <span className="text-[14px] font-black text-gray-900 truncate uppercase tracking-tighter">{formData.receiptFileName}</span>
                                            </div>
                                            <button type="button" onClick={removeFile} className="p-1.5 hover:bg-primary-50 rounded-xl text-primary-600 transition-colors">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-10 flex flex-col items-center gap-6">
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full bg-primary-600 text-white py-5 rounded-2xl font-black text-[14px] shadow-2xl shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center uppercase tracking-[0.3em] gap-3"
                            >
                                <Send className="h-4 w-4" />
                                Submit Requisition
                            </motion.button>
                            <div className="flex items-center gap-2 text-gray-400">
                                <ShieldCheck className="h-4 w-4 text-primary-600/40" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified Secure Endpoint</span>
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default PettyCashForm;