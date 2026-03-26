// src/components/WorkflowActionModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, AlertCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const WorkflowActionModal = ({ isOpen, onClose, onSubmit, type, title, placeholder, viewOnly = false, content = '', imageUrl = null }) => {
    const [description, setDescription] = useState('');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [error, setError] = useState('');

    // Update description if content changes (for view-only mode)
    React.useEffect(() => {
        if (viewOnly) {
            setDescription(content);
        } else {
            setDescription('');
        }
        setError('');
    }, [viewOnly, content, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e, status = null) => {
        if (e) e.preventDefault();
        if (viewOnly) {
            onClose();
            return;
        }
        onSubmit(description, status);
        setDescription('');
        onClose();
    };

    const handleReject = () => {
        if (!description.trim()) {
            const errorMsg = type === 'payment' ? 'Please provide a reason for holding the payment.' : 'Please provide a reason for rejection in the comments field.';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }
        setError('');
        handleSubmit(null, type === 'payment' ? 'onhold' : 'rejected');
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-gray-800"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                                <MessageSquare className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">{title}</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">
                                {viewOnly ? 'Submitted Message' : 'Add Description / Comments'}
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => {
                                    if (!viewOnly) {
                                        setDescription(e.target.value);
                                        if (e.target.value.trim()) setError('');
                                    }
                                }}
                                placeholder={placeholder || "Enter your comments here..."}
                                className={`w-full h-24 px-4 py-3 bg-gray-50 dark:bg-gray-800 border ${error ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-200 dark:border-gray-700'} rounded-2xl outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100 font-medium resize-none shadow-inner ${viewOnly ? 'cursor-default opacity-80' : 'focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600'}`}
                                required={!viewOnly}
                                readOnly={viewOnly}
                            />
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-1.5 px-2 py-1 text-red-500 text-[10px] font-bold uppercase tracking-wider"
                                >
                                    <AlertCircle className="h-3 w-3" />
                                    {error}
                                </motion.div>
                            )}
                        </div>

                        {imageUrl && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">
                                    Attachment / Receipt
                                </label>
                                <div 
                                    className="relative group rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 cursor-pointer"
                                    onClick={() => setIsPreviewOpen(true)}
                                >
                                    <img 
                                        src={imageUrl} 
                                        alt="Receipt" 
                                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/600x400?text=Receipt+Not+Found';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="px-4 py-2 bg-white text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all">
                                            View Full Preview
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            {!viewOnly ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleReject}
                                        className="flex-1 px-6 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/10 dark:hover:bg-red-900/20 dark:text-red-400 text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/30"
                                    >
                                        {type === 'payment' ? <Clock className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                        {type === 'payment' ? 'Put On Hold' : 'Reject'}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[1.5] px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                                    >
                                        <Send className="h-4 w-4" />
                                        {title.includes('Verify') ? 'Verify Request' : title.includes('Approve') ? 'Approve/Authorize' : 'Submit Settlement'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                                >
                                    Acknowledge
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>

                {/* Internal Image Preview Overlay */}
                <AnimatePresence>
                    {isPreviewOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                            onClick={() => setIsPreviewOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative max-w-5xl w-full h-full flex items-center justify-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="absolute -top-12 right-0 p-3 text-white/70 hover:text-white transition-colors"
                                >
                                    <X className="h-8 w-8" />
                                </button>
                                <img
                                    src={imageUrl}
                                    alt="Receipt Full Preview"
                                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                                />
                                <div className="absolute -bottom-12 left-0 right-0 text-center">
                                    <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">
                                        Click anywhere outside or press X to close
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
};

export default WorkflowActionModal;
