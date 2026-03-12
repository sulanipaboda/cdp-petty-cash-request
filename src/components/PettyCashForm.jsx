// src/components/PettyCashForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, MapPin, Package, FileText, Send, Upload, DollarSign, X, CheckCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addRequest } from '../store/pettyCashSlice';

const PettyCashForm = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        date: '',
        fullName: '',
        branchLocation: '',
        dateNeeded: '',
        stationaries: '',
        requestType: 'New Purchase',
        amount: '',
        receiptFile: null,
        receiptFileName: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }

            // Check file type
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
        setFormData(prev => ({
            ...prev,
            receiptFile: null,
            receiptFileName: ''
        }));
        // Reset the file input
        document.getElementById('receipt-upload').value = '';
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        // Convert from dd/MM/yyyy to yyyy-MM-dd for input
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        // Convert from yyyy-MM-dd to dd/MM/yyyy for display
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleDateChange = (e, fieldName) => {
        const { value } = e.target;
        // Store the yyyy-MM-dd format in state
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.date || !formData.fullName || !formData.branchLocation ||
            !formData.dateNeeded || !formData.stationaries || !formData.amount) {
            toast.error('Please fill in all fields');
            return;
        }

        // Validate file upload for reimbursement
        if (formData.requestType === 'Reimbursement of Existing purchase' && !formData.receiptFile) {
            toast.error('Please upload a receipt for reimbursement');
            return;
        }

        // Create new request
        const newRequest = {
            id: Date.now().toString(),
            ...formData,
            date: formatDateForDisplay(formData.date),
            dateNeeded: formatDateForDisplay(formData.dateNeeded),
            status: 'pending',
            submittedAt: new Date().toISOString(),
            receiptFileName: formData.receiptFileName || null,
        };

        // In a real app, you would upload the file to a server here
        // For now, we'll just store the file name
        delete newRequest.receiptFile; // Don't store the actual file in Redux

        dispatch(addRequest(newRequest));
        toast.success('Request submitted successfully!');

        // Reset form
        setFormData({
            date: '',
            fullName: '',
            branchLocation: '',
            dateNeeded: '',
            stationaries: '',
            requestType: 'New Purchase',
            amount: '',
            receiptFile: null,
            receiptFileName: '',
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-500"
            >
                {/* Hero Header */}
                <div className="relative h-32 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center px-8 overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.4),transparent)]"></div>
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="h-14 w-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
                            <FileText className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white uppercase tracking-tighter leading-none">Petty Cash</h1>
                            <p className="text-primary-100 mt-1 text-[10px] font-medium opacity-80 uppercase tracking-widest">Digital Requisition Portal</p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Section 1: Core Details */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-[9px]">01</div>
                            <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Basic Information</h2>
                            <div className="flex-1 h-[1px] bg-gray-100 dark:bg-gray-800"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Requester Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent dark:border-gray-700/50 rounded-xl focus:ring-1 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-gray-100 font-bold text-[12px] placeholder:text-gray-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Branch Location</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="text"
                                        name="branchLocation"
                                        value={formData.branchLocation}
                                        onChange={handleChange}
                                        placeholder="Operational branch"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent dark:border-gray-700/50 rounded-xl focus:ring-1 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-gray-100 font-bold text-[12px] placeholder:text-gray-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Timeline */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-[9px]">02</div>
                            <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Timeline Specification</h2>
                            <div className="flex-1 h-[1px] bg-gray-100 dark:bg-gray-800"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Submission Date</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors" />
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={(e) => handleDateChange(e, 'date')}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent dark:border-gray-700/50 rounded-xl focus:ring-1 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-gray-100 font-bold text-[12px]"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Funds Required By</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-500 transition-colors" />
                                    <input
                                        type="date"
                                        name="dateNeeded"
                                        value={formData.dateNeeded}
                                        onChange={(e) => handleDateChange(e, 'dateNeeded')}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-primary-500/20 dark:border-primary-500/30 rounded-xl focus:ring-1 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-gray-100 font-bold text-[12px]"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Request Nature */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-[9px]">03</div>
                            <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Request Details</h2>
                            <div className="flex-1 h-[1px] bg-gray-100 dark:bg-gray-800"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.requestType === 'New Purchase' ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-500 ring-2 ring-primary-500/5' : 'bg-transparent border-gray-100 dark:border-gray-800 hover:border-primary-200'}`}>
                                <input
                                    type="radio"
                                    name="requestType"
                                    value="New Purchase"
                                    checked={formData.requestType === 'New Purchase'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-primary-600 border-gray-300"
                                />
                                <div className="flex flex-col">
                                    <span className={`text-[13px] font-black tracking-tight ${formData.requestType === 'New Purchase' ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'}`}>Standard</span>
                                    <span className="text-[8px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">New Expenditure</span>
                                </div>
                            </label>
                            <label className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.requestType === 'Reimbursement of Existing purchase' ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-500 ring-2 ring-primary-500/5' : 'bg-transparent border-gray-100 dark:border-gray-800 hover:border-primary-200'}`}>
                                <input
                                    type="radio"
                                    name="requestType"
                                    value="Reimbursement of Existing purchase"
                                    checked={formData.requestType === 'Reimbursement of Existing purchase'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-primary-600 border-gray-300"
                                />
                                <div className="flex flex-col">
                                    <span className={`text-[13px] font-black tracking-tight ${formData.requestType === 'Reimbursement of Existing purchase' ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'}`}>Reimbursement</span>
                                    <span className="text-[8px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Past Expenditure</span>
                                </div>
                            </label>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Itemization & Description</label>
                            <textarea
                                name="stationaries"
                                value={formData.stationaries}
                                onChange={handleChange}
                                placeholder="Details..."
                                rows="2"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent dark:border-gray-700/50 rounded-xl focus:ring-1 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-gray-100 font-medium text-[12px] placeholder:text-gray-500 resize-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Section 4: Evidence & Valuation */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-[9px]">04</div>
                            <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Financial Evidence</h2>
                            <div className="flex-1 h-[1px] bg-gray-100 dark:bg-gray-800"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Transaction Value (LKR)</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                        <DollarSign className="h-4 w-4 text-primary-500" />
                                        <span className="text-[9px] font-black text-gray-400 uppercase">LKR</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full pl-16 pr-4 py-2.5 bg-gray-900 text-white rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm font-black placeholder:text-gray-700"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-1">Evidence Attachment</label>
                                <AnimatePresence mode="wait">
                                    {!formData.receiptFile ? (
                                        <motion.div
                                            key="upload"
                                            className="relative h-[42px] flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50"
                                        >
                                            <label className="absolute inset-0 cursor-pointer flex items-center px-4 gap-3">
                                                <Upload className="h-4 w-4 text-gray-400" />
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight">Select Evidence</span>
                                                <input
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    accept=".jpg,.jpeg,.png,.pdf"
                                                />
                                            </label>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="file"
                                            className="h-[42px] flex items-center justify-between px-4 bg-primary-600 rounded-xl"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <CheckCircle className="h-4 w-4 text-white" />
                                                <span className="text-[10px] font-black text-white uppercase truncate max-w-[100px]">{formData.receiptFileName}</span>
                                            </div>
                                            <button type="button" onClick={removeFile} className="p-1 hover:bg-white/10 rounded-lg text-white">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Submit Area */}
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-4">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02, translateY: -1 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full max-w-xs bg-primary-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-lg shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all flex items-center justify-center gap-3"
                        >
                            <Send className="h-3.5 w-3.5" />
                            Submit Requisition
                        </motion.button>
                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-[0.1em]">Encrypted Secure Submission</span>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default PettyCashForm;