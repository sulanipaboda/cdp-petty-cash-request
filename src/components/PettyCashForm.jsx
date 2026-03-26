// src/components/PettyCashForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, MapPin, Package, FileText, Send, Upload, DollarSign, X, CheckCircle, ShieldCheck, Hash, Briefcase, Layers, UserCheck, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchBranches, fetchDepartments, submitRequest } from '../store/pettyCashSlice';
import logo from '../assets/logo.png';
import { useEffect } from 'react';

const PettyCashForm = () => {
    const dispatch = useDispatch();
    const { categories, branches, departments, submitStatus } = useSelector(state => state.pettyCash);
    const { currentUser } = useSelector(state => state.user);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchBranches());
        dispatch(fetchDepartments());
    }, [dispatch]);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        branchId: '',
        departmentId: '',
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
        accountNumber: '',
        bankName: '',
        bankBranch: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.fullName || !formData.email || !formData.branchId ||
            !formData.dateNeeded || !formData.category || !formData.amount) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.requestType === 'Reimbursement' && !formData.receiptFile) {
            toast.error('Please upload a receipt for reimbursement');
            return;
        }

        const data = new FormData();
        
        // Map frontend fields to backend snake_case fields
        data.append('full_name', formData.fullName);
        data.append('email', formData.email);
        data.append('branch_id', formData.branchId);
        data.append('department_id', formData.departmentId || '');
        data.append('date_needed', formData.dateNeeded);
        data.append('category_id', formData.category); // category state holds the ID
        data.append('description', formData.description || '');
        data.append('amount', formData.amount);
        
        // Transform Request Type to backend expected values
        const backendType = formData.requestType === 'Reimbursement' ? 'reimbursement' : 'new_purchase';
        data.append('type', backendType);

        // Handle bank details
        data.append('account_number', formData.accountNumber);
        data.append('bank_name', formData.bankName);
        data.append('bank_branch', formData.bankBranch);

        // Handle file upload
        if (formData.receiptFile) {
            data.append('receipt_image_path', formData.receiptFile);
        }

        try {
            await dispatch(submitRequest(data)).unwrap();
            
            // Show Success Overlay
            setShowSuccess(true);
            
            // Success Modal Auto-close and form reset after 1 second
            setTimeout(() => {
                setShowSuccess(false);
                setFormData({
                    fullName: '',
                    email: '',
                    branchId: '',
                    departmentId: '',
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
                    accountNumber: '',
                    bankName: '',
                    bankBranch: '',
                });
                if (document.getElementById('receipt-upload')) {
                    document.getElementById('receipt-upload').value = '';
                }
            }, 1000);

        } catch (error) {
            toast.error(error.message || 'Submission failed');
        }
    };


    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-4 relative overflow-hidden">
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
                className="w-full max-w-5xl relative z-10 my-4"
            >
                <div className="bg-white rounded-[2rem] shadow-[0_30px_70px_rgba(41,140,119,0.08)] p-6 md:p-8 border border-primary-50 relative overflow-hidden">
                    {/* Watermark Logo */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.10]">
                        <img src={logo} alt="Background Watermark" className="w-[90%] max-w-[800px] h-auto object-contain -rotate-6" />
                    </div>

                    <div className="text-center mb-8 relative z-10">
                        <h1 className="flex items-baseline justify-center leading-none tracking-tight select-none">
                            <span
                                style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: 'italic', fontSize: '4rem' }}
                                className="font-normal text-primary-600"
                            >e</span>
                            <span
                                style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
                                className="text-4xl font-black text-black tracking-tight"
                            >Petty</span>
                        </h1>
                        <p className="text-gray-500 mt-3 text-[11px] font-bold uppercase tracking-[0.25em] leading-none">Petty Cash Management System</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Row 1 */}
                            <div className="relative group mt-2">
                                <User className="absolute left-0 bottom-2 h-5 w-5 text-primary-600" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="w-full pl-8 pb-2 bg-transparent border-b border-gray-300 focus:border-primary-600 outline-none transition-all text-[13px] font-bold text-black placeholder:text-gray-500"
                                    required
                                />
                            </div>
                            <div className="relative group mt-2">
                                <UserCheck className="absolute left-0 bottom-2 h-5 w-5 text-primary-600" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Work Email"
                                    className="w-full pl-8 pb-2 bg-transparent border-b border-gray-300 focus:border-primary-600 outline-none transition-all text-[13px] font-bold text-black placeholder:text-gray-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* 3-Column Grid for Primary Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="relative group mt-6">
                                <MapPin className="absolute left-0 bottom-2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                <select
                                    name="branchId"
                                    value={formData.branchId}
                                    onChange={handleChange}
                                    className="w-full pl-8 pb-2 bg-transparent border-b border-gray-300 focus:border-primary-600 outline-none transition-all text-[13px] font-bold text-black appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" disabled className="text-gray-500">Select Branch</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id} className="text-black">{branch.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative group mt-6">
                                <Briefcase className="absolute left-0 bottom-2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                <select
                                    name="departmentId"
                                    value={formData.departmentId}
                                    onChange={handleChange}
                                    className="w-full pl-8 pb-2 bg-transparent border-b border-gray-300 focus:border-primary-600 outline-none transition-all text-[13px] font-bold text-black appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" disabled className="text-gray-500">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id} className="text-black">{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Row 2 */}
                            <div className="relative group mt-6">
                                <Calendar className="absolute left-0 bottom-2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                <label className="absolute left-8 top-[-16px] text-[10px] font-black text-primary-600 uppercase tracking-widest">Funds Required By</label>
                                <input
                                    type="date"
                                    name="dateNeeded"
                                    value={formData.dateNeeded}
                                    onChange={(e) => handleDateChange(e, 'dateNeeded')}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-8 pb-2 bg-transparent border-b border-gray-300 focus:border-primary-600 outline-none transition-all text-[13px] font-bold text-black"
                                    required
                                />
                            </div>
                            <div className="relative group mt-6">
                                <Layers className="absolute left-0 bottom-2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full pl-8 pb-2 bg-transparent border-b border-gray-300 focus:border-primary-600 outline-none transition-all text-[13px] font-bold text-black appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" disabled className="text-gray-500">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id} className="text-black">{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative group mt-6 flex flex-col justify-end">
                                <DollarSign className="absolute left-0 bottom-2 h-5 w-5 text-primary-600" />
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="Value (LKR)"
                                    step="0.01"
                                    className="w-full pl-8 pb-2 bg-transparent border-b border-gray-300 focus:border-primary-600 outline-none transition-all text-[15px] font-black text-black placeholder:text-gray-500"
                                    required
                                />
                                <span className="absolute right-0 bottom-2 text-[10px] font-black text-primary-600 uppercase tracking-widest">LKR</span>
                            </div>
                        </div>

                        {/* Bank Details Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="relative group mt-2">
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    placeholder="Account Number"
                                    className="w-full pb-2 bg-transparent border-b border-gray-300 focus:border-primary-600 outline-none transition-all text-[13px] font-bold text-black placeholder:text-gray-500"
                                    required
                                />
                            </div>
                            <div className="relative group mt-2">
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    placeholder="Bank Name"
                                    className="w-full pb-2 bg-transparent border-b border-gray-300 focus:border-primary-600 outline-none transition-all text-[13px] font-bold text-black placeholder:text-gray-500"
                                    required
                                />
                            </div>
                            <div className="relative group mt-2">
                                <input
                                    type="text"
                                    name="bankBranch"
                                    value={formData.bankBranch}
                                    onChange={handleChange}
                                    placeholder="Bank Branch"
                                    className="w-full pb-2 bg-transparent border-b border-gray-300 focus:border-primary-600 outline-none transition-all text-[13px] font-bold text-black placeholder:text-gray-500"
                                    required
                                />
                            </div>
                        </div>


                        {/* Full Width Sections */}
                        <div className="space-y-4 pt-4 border-t border-gray-100 mt-6">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
                                <h2 className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Request Nature</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${formData.requestType === 'New Purchase' ? 'bg-primary-50 border-primary-600 shadow-sm shadow-primary-200' : 'bg-transparent border-gray-300 hover:border-primary-300'}`}>
                                    <input type="radio" name="requestType" value="New Purchase" checked={formData.requestType === 'New Purchase'} onChange={handleChange} className="sr-only" />
                                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.requestType === 'New Purchase' ? 'border-primary-600' : 'border-gray-400'}`}>
                                        {formData.requestType === 'New Purchase' && <div className="h-2 w-2 rounded-full bg-primary-600" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-black text-black tracking-tight leading-none mb-1">New Purchase</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Standard Exp.</span>
                                    </div>
                                </label>
                                <label className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${formData.requestType === 'Reimbursement' ? 'bg-primary-50 border-primary-600 shadow-sm shadow-primary-200' : 'bg-transparent border-gray-300 hover:border-primary-300'}`}>
                                    <input type="radio" name="requestType" value="Reimbursement" checked={formData.requestType === 'Reimbursement'} onChange={handleChange} className="sr-only" />
                                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.requestType === 'Reimbursement' ? 'border-primary-600' : 'border-gray-400'}`}>
                                        {formData.requestType === 'Reimbursement' && <div className="h-2 w-2 rounded-full bg-primary-600" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-black text-black tracking-tight leading-none mb-1">Reimbursement</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Past Exp.</span>
                                    </div>
                                </label>
                            </div>

                            {/* File Upload (Moved here under Request Nature) */}
                            <AnimatePresence>
                                {formData.requestType === 'Reimbursement' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="relative w-full overflow-hidden"
                                    >
                                        {!formData.receiptFile ? (
                                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-primary-200 border-dashed rounded-xl cursor-pointer bg-primary-50/30 hover:bg-primary-50 hover:border-primary-600 transition-all group mt-2">
                                                <div className="flex flex-col items-center justify-center pt-3 pb-4">
                                                    <Upload className="w-6 h-6 mb-2 text-primary-500 group-hover:text-primary-700 transition-colors" />
                                                    <p className="mb-1 text-xs text-gray-700 group-hover:text-black"><span className="font-bold">Click to upload</span> receipt</p>
                                                    <p className="text-[10px] text-gray-500">JPG, PNG, PDF (MAX. 5MB)</p>
                                                </div>
                                                <input id="receipt-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" required />
                                            </label>
                                        ) : (
                                            <div className="flex items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-xl mt-2">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                                                    <span className="text-[13px] font-black text-black truncate uppercase tracking-tighter">{formData.receiptFileName}</span>
                                                </div>
                                                <button type="button" onClick={removeFile} className="p-1 hover:bg-white rounded-lg text-primary-600 transition-colors flex-shrink-0 shadow-sm border border-transparent hover:border-gray-300">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative group flex flex-col pt-4">
                                <label className="flex items-center gap-2 mb-2 text-[12px] font-black text-gray-600 uppercase tracking-widest">
                                    <FileText className="h-4 w-4 text-primary-600" />
                                    Description of Expenditure
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Please provide a detailed description of the expenditure..."
                                    rows="6"
                                    className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 outline-none transition-all text-[14px] font-bold text-black placeholder:text-gray-500 resize-none shadow-sm shadow-gray-200 hover:border-gray-400"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 flex flex-col items-center gap-4">
                            <motion.button
                                type="submit"
                                disabled={submitStatus === 'loading'}
                                whileHover={submitStatus === 'loading' ? {} : { scale: 1.01 }}
                                whileTap={submitStatus === 'loading' ? {} : { scale: 0.99 }}
                                className={`w-full py-3.5 rounded-xl font-black text-[13px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
                                    submitStatus === 'loading' 
                                    ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                                    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-[0_10px_20px_rgba(41,140,119,0.3)]'
                                }`}
                            >
                                {submitStatus === 'loading' ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Submit Requisition
                                    </>
                                )}
                            </motion.button>
                            <div className="flex items-center gap-2 text-gray-600">
                                <ShieldCheck className="h-4 w-4 text-primary-600" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Verified Secure Endpoint</span>
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* Animated Loading Overlay */}
            <AnimatePresence>
                {submitStatus === 'loading' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-24 h-24 border-4 border-primary-600/20 border-t-primary-600 rounded-full"
                            />
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Loader2 className="h-10 w-10 text-primary-600 animate-pulse" />
                            </motion.div>
                        </div>
                        <motion.h2 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 text-2xl font-black text-gray-900 uppercase tracking-[0.2em]"
                        >
                            Processing 
                            <span className="text-primary-600">Request</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-3 text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed"
                        >
                            Please wait while we secure your requisition...<br />
                            This may take a moment.
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-white flex flex-col items-center justify-center p-6 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.1
                            }}
                            className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center shadow-2xl shadow-primary-200"
                        >
                            <Check className="h-12 w-12 text-white" />
                        </motion.div>
                        <motion.h2 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 text-3xl font-black text-gray-900 uppercase tracking-[0.1em]"
                        >
                            Request <span className="text-primary-600">Submitted!</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-3 text-[12px] font-bold text-gray-500 uppercase tracking-widest"
                        >
                            Your requisition has been recorded successfully.
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PettyCashForm;
