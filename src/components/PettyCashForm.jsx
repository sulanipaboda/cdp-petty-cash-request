// src/components/PettyCashForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, MapPin, Package, FileText, Send, Upload, DollarSign, X } from 'lucide-react';
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
        >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FileText className="h-6 w-6" />
                        Petty Cash Request Form
                    </h1>
                    <p className="text-primary-100 mt-2">Fill in the details below to submit your request</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Date */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            1. Date (dd/MM/yyyy)
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={(e) => handleDateChange(e, 'date')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            required
                        />
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            2. Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            required
                        />
                    </div>

                    {/* Branch Location */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            3. Branch Location
                        </label>
                        <input
                            type="text"
                            name="branchLocation"
                            value={formData.branchLocation}
                            onChange={handleChange}
                            placeholder="Enter branch location"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            required
                        />
                    </div>

                    {/* Date Needed */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            4. Date Needed (dd/MM/yyyy)
                        </label>
                        <input
                            type="date"
                            name="dateNeeded"
                            value={formData.dateNeeded}
                            onChange={(e) => handleDateChange(e, 'dateNeeded')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            required
                        />
                    </div>

                    {/* Stationaries */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            5. Stationaries needed for the location
                        </label>
                        <textarea
                            name="stationaries"
                            value={formData.stationaries}
                            onChange={handleChange}
                            placeholder="List the stationaries needed..."
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                            required
                        />
                    </div>

                    {/* Request Type */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            6. Type of the Request
                        </label>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                <input
                                    type="radio"
                                    name="requestType"
                                    value="New Purchase"
                                    checked={formData.requestType === 'New Purchase'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-gray-700">New Purchase</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                                <input
                                    type="radio"
                                    name="requestType"
                                    value="Reimbursement of Existing purchase"
                                    checked={formData.requestType === 'Reimbursement of Existing purchase'}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-gray-700">Reimbursement of Existing purchase</span>
                            </label>
                        </div>
                    </div>

                    {/* Conditional File Upload for Reimbursement */}
                    <AnimatePresence>
                        {formData.requestType === 'Reimbursement of Existing purchase' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2 overflow-hidden"
                            >
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    7. Upload Receipt (Required for Reimbursement)
                                </label>

                                {!formData.receiptFile ? (
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 transition-colors">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="receipt-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                                                >
                                                    <span>Upload a file</span>
                                                    <input
                                                        id="receipt-upload"
                                                        name="receipt-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        onChange={handleFileChange}
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, PDF up to 5MB
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-700 truncate max-w-xs">
                                                {formData.receiptFileName}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                        >
                                            <X className="h-4 w-4 text-gray-500" />
                                        </button>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500">
                                    Please upload a clear image or PDF of your receipt
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <DollarSign className="h-4 w-4 text-primary-600" />
                            {formData.requestType === 'Reimbursement of Existing purchase' ? '8' : '7'}. Amount (LKR)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Rs.</span>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                    >
                        <Send className="h-4 w-4" />
                        Submit Request
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};

export default PettyCashForm;