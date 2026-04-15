// src/components/EditPettyCashModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Save, User, MapPin, Briefcase, Calendar, Layers,
    DollarSign, FileText, Upload, CheckCircle, CreditCard,
    Building2, Landmark, ShieldCheck, AlertCircle, Loader2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePettyCash } from '../store/pettyCashSlice';
import toast from 'react-hot-toast';

const EditPettyCashModal = ({ request, onClose, onSaved }) => {
    const dispatch = useDispatch();
    const { categories, branches, departments } = useSelector(s => s.pettyCash);
    const updateStatus = useSelector(s => s.pettyCash.updateStatus);

    const [form, setForm] = useState({});
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptFileName, setReceiptFileName] = useState('');
    const [errors, setErrors] = useState([]);

    // Populate form when request changes
    useEffect(() => {
        if (!request) return;
        setForm({
            full_name:            request.full_name  ?? '',
            email:                request.email       ?? '',
            branch_id:            request.branch_id   ?? request.branch?.id  ?? '',
            department_id:        request.department_id ?? request.department?.id ?? '',
            date_needed:          request.date_needed ? request.date_needed.split('T')[0] : '',
            category_id:          request.category_id ?? request.category?.id ?? '',
            description:          request.description ?? '',
            type:                 request.type        ?? 'new_purchase',
            amount:               request.amount      ?? '',
            account_number:       request.account_number ?? '',
            bank_name:            request.bank_name   ?? '',
            bank_branch:          request.bank_branch ?? '',
            status:               request.status      ?? 'pending',
            payment_status:       request.payment_status ?? 'pending',
            verified_description:  request.verified_description  ?? '',
            approved_description:  request.approved_description  ?? '',
            rejected_description:  request.rejected_description  ?? '',
            payment_description:   request.payment_description   ?? '',
        });
        setReceiptFile(null);
        setReceiptFileName('');
        setErrors([]);
    }, [request]);

    if (!request) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 20 * 1024 * 1024) {
            toast.error('File size must be under 20 MB');
            return;
        }
        const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!allowed.includes(file.type)) {
            toast.error('Only JPG, PNG or PDF files are allowed');
            return;
        }
        setReceiptFile(file);
        setReceiptFileName(file.name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const data = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            // Send empty-string for nullable fields so backend treats them as provided
            data.append(key, val ?? '');
        });
        if (receiptFile) {
            data.append('receipt_image_path', receiptFile);
        }

        try {
            await dispatch(updatePettyCash({ id: request.id, formData: data })).unwrap();
            toast.success('Petty cash updated successfully!');
            onSaved?.();
            onClose();
        } catch (err) {
            // Surface validation errors from backend
            if (err?.errors && Array.isArray(err.errors)) {
                setErrors(err.errors);
                toast.error(err.message || 'Validation failed');
            } else {
                toast.error(err?.message || 'Failed to update petty cash');
            }
        }
    };

    const isLoading = updateStatus === 'loading';

    // ---------- Section helpers ----------
    const Label = ({ children }) => (
        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">{children}</p>
    );

    const inputClass = "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium text-gray-900 dark:text-gray-100 transition-all";
    const selectClass = `${inputClass} cursor-pointer`;
    const textareaClass = `${inputClass} resize-none`;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col border border-white/10"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative overflow-hidden bg-primary-600 px-8 py-7 flex-shrink-0">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                        <div className="relative flex items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/10">
                                        {request.reference_number || 'PETTY CASH'}
                                    </span>
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black text-amber-200 uppercase tracking-widest border border-white/10 flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3" /> Super Edit
                                    </span>
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Edit Petty Cash</h2>
                                <p className="text-white/60 text-xs mt-1 font-medium">All fields are editable. Changes take effect immediately.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 text-white/70 hover:text-white flex-shrink-0"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Validation errors */}
                    {errors.length > 0 && (
                        <div className="mx-8 mt-4 flex-shrink-0 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 space-y-1">
                            {errors.map((err, i) => (
                                <p key={i} className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
                                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                    <span className="capitalize">{err.field}</span>: {err.messages?.join(', ')}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* ── LEFT: Requester & Request ── */}
                            <div className="space-y-5">
                                <SectionHeading icon={User} label="Requester Details" />

                                <div className="grid grid-cols-1 gap-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                                    <div>
                                        <Label>Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input name="full_name" value={form.full_name} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="Full Name" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="work@email.com" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label>Branch</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select name="branch_id" value={form.branch_id} onChange={handleChange} className={`${selectClass} pl-10`}>
                                                    <option value="">Select Branch</option>
                                                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Department</Label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select name="department_id" value={form.department_id} onChange={handleChange} className={`${selectClass} pl-10`}>
                                                    <option value="">None</option>
                                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <SectionHeading icon={FileText} label="Request Details" />

                                <div className="space-y-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label>Date Needed</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input name="date_needed" type="date" value={form.date_needed} onChange={handleChange} className={`${inputClass} pl-10`} />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Category</Label>
                                            <div className="relative">
                                                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <select name="category_id" value={form.category_id} onChange={handleChange} className={`${selectClass} pl-10`}>
                                                    <option value="">Select Category</option>
                                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Amount (LKR)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input name="amount" type="number" step="0.01" min="0" value={form.amount} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="0.00" />
                                        </div>
                                    </div>

                                    {/* Type toggle */}
                                    <div>
                                        <Label>Request Type</Label>
                                        <div className="flex gap-3 mt-1">
                                            {[{ val: 'new_purchase', label: 'New Purchase' }, { val: 'reimbursement', label: 'Reimbursement' }].map(opt => (
                                                <label key={opt.val}
                                                    className={`flex-1 flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-xs font-black uppercase tracking-widest ${form.type === opt.val ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary-300'}`}
                                                >
                                                    <input type="radio" name="type" value={opt.val} checked={form.type === opt.val} onChange={handleChange} className="sr-only" />
                                                    <span className={`h-3.5 w-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${form.type === opt.val ? 'border-primary-500' : 'border-gray-400'}`}>
                                                        {form.type === opt.val && <span className="h-2 w-2 rounded-full bg-primary-500 block" />}
                                                    </span>
                                                    {opt.label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Description</Label>
                                        <textarea name="description" rows={3} value={form.description} onChange={handleChange} className={textareaClass} placeholder="Purpose of expenditure..." />
                                    </div>

                                    {/* Receipt upload */}
                                    <div>
                                        <Label>Receipt File {request.receipt_image_path && <span className="normal-case text-gray-400 font-medium">(current: {request.receipt_image_path.split('/').pop()})</span>}</Label>
                                        {receiptFileName ? (
                                            <div className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl">
                                                <CheckCircle className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                                                <span className="text-xs font-black text-gray-900 dark:text-gray-100 truncate">{receiptFileName}</span>
                                                <button type="button" onClick={() => { setReceiptFile(null); setReceiptFileName(''); }} className="ml-auto p-1 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors">
                                                    <X className="h-3.5 w-3.5 text-gray-400" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all">
                                                <Upload className="h-4 w-4 text-gray-400" />
                                                <span className="text-xs font-bold text-gray-500">Upload replacement file (JPG, PNG, PDF — max 20 MB)</span>
                                                <input type="file" className="sr-only" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ── RIGHT: Bank + Status ── */}
                            <div className="space-y-5">
                                <SectionHeading icon={Landmark} label="Banking Details" />

                                <div className="space-y-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                                    <div>
                                        <Label>Account Number</Label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input name="account_number" value={form.account_number} onChange={handleChange} className={`${inputClass} pl-10 font-mono`} placeholder="Account Number" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label>Bank Name</Label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input name="bank_name" value={form.bank_name} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="Bank Name" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Bank Branch</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input name="bank_branch" value={form.bank_branch} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="Branch" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <SectionHeading icon={ShieldCheck} label="Status Overrides" color="text-amber-600" />

                                <div className="space-y-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl p-5 border border-amber-100 dark:border-amber-900/30">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label>Approval Status</Label>
                                            <select name="status" value={form.status} onChange={handleChange} className={selectClass}>
                                                <option value="pending">Pending</option>
                                                <option value="verified">Verified</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Payment Status</Label>
                                            <select name="payment_status" value={form.payment_status} onChange={handleChange} className={selectClass}>
                                                <option value="pending">Pending</option>
                                                <option value="onhold">On Hold</option>
                                                <option value="paid">Paid</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Verification Notes</Label>
                                        <textarea name="verified_description" rows={2} value={form.verified_description} onChange={handleChange} className={textareaClass} placeholder="Verification remarks..." />
                                    </div>
                                    <div>
                                        <Label>Approval Notes</Label>
                                        <textarea name="approved_description" rows={2} value={form.approved_description} onChange={handleChange} className={textareaClass} placeholder="Approval remarks..." />
                                    </div>
                                    <div>
                                        <Label>Rejection Reason</Label>
                                        <textarea name="rejected_description" rows={2} value={form.rejected_description} onChange={handleChange} className={textareaClass} placeholder="Rejection reason..." />
                                    </div>
                                    <div>
                                        <Label>Payment Description</Label>
                                        <textarea name="payment_description" rows={2} value={form.payment_description} onChange={handleChange} className={textareaClass} placeholder="Payment/settlement notes..." />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="px-8 py-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4 flex-shrink-0">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden md:block">
                            Super User Action — changes are immediate
                        </p>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 md:flex-none px-6 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-[11px] font-black uppercase tracking-widest disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="edit-pc-form"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex-1 md:flex-none px-10 py-3 bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-900/20 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                                ) : (
                                    <><Save className="h-4 w-4" /> Save Changes</>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const SectionHeading = ({ icon: Icon, label, color = 'text-primary-600' }) => (
    <div className="flex items-center gap-2">
        <div className={`p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg ${color}`}>
            <Icon className="h-4 w-4" />
        </div>
        <span className="text-[11px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-[0.2em]">{label}</span>
    </div>
);

export default EditPettyCashModal;
