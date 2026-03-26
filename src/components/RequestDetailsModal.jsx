// src/components/RequestDetailsModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calendar, User, MapPin, Package, FileText,
  Clock, CheckCircle, XCircle, Hash, Building2,
  CreditCard, Briefcase, Wallet, Landmark, Info,
  ExternalLink, ArrowRight
} from 'lucide-react';

const RequestDetailsModal = ({ request, onClose, onUpdateStatus, canUpdateStatus }) => {
  if (!request) return null;

  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/v1\/?$/, '') || '';
  const finalImageUrl = request.receipt_image_path ? `${apiBase}/${request.receipt_image_path}`.replace(/([^:]\/)\/+/g, "$1") : null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved': return { color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100', icon: CheckCircle, label: 'Approved' };
      case 'rejected': return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: XCircle, label: 'Rejected' };
      case 'verified': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: CheckCircle, label: 'Verified' };
      default: return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock, label: 'Pending' };
    }
  };

  const status = getStatusConfig(request.status);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero Header */}
          <div className="relative overflow-hidden bg-primary-600 px-8 py-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/5">
                    {request.reference_number || 'PETTY CASH'}
                  </span>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.color} border ${status.border}`}>
                    <status.icon className="h-3 w-3" />
                    {status.label}
                  </div>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Request Overview</h2>
                <p className="text-gray-400 text-xs mt-3 mb-4 font-medium flex items-center gap-2 italic">
                  <Clock className="h-3 w-3" />
                  Submitted on {formatDate(request.created_at)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="absolute top-0 right-0 md:relative p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 text-white/50 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Left Column: Requester & Identity */}
              <div className="space-y-6">
                <SectionLabel icon={User} label="Requester Identity" />
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4">
                  <InfoCard label="Full Name" value={request.full_name} subValue={request.email} icon={User} />
                  <div className="h-px bg-gray-200/50 dark:bg-gray-700/50"></div>
                  <InfoCard label="Branch Location" value={request.branch?.name || 'Main Office'} icon={MapPin} color="text-blue-600" />
                  <div className="h-px bg-gray-200/50 dark:bg-gray-700/50"></div>
                  <InfoCard label="Department" value={request.department?.name || 'General'} icon={Briefcase} color="text-purple-600" />
                </div>

                <SectionLabel icon={Wallet} label="Expenditure Details" />
                <div className="bg-primary-600 p-6 rounded-3xl shadow-xl shadow-primary-900/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Wallet className="h-24 w-24 text-white" />
                  </div>
                  <div className="relative">
                    <p className="text-primary-100 text-[10px] font-black uppercase tracking-widest mb-1">Total Amount Requested</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-white text-3xl font-black tracking-tighter">LKR {parseFloat(request.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white/10 rounded-xl text-white text-[10px] font-bold uppercase backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                        <Package className="h-3 w-3" />
                        {request.category?.name || 'General'}
                      </span>
                      <span className="px-3 py-1 bg-white/10 rounded-xl text-white text-[10px] font-bold uppercase backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                        <FileText className="h-3 w-3" />
                        {(request.type || '').replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Bank & Timeline */}
              <div className="space-y-6">
                <SectionLabel icon={Landmark} label="Settlement Details" />
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
                  <InfoCard label="Account Number" value={request.account_number || 'N/A'} icon={CreditCard} color="text-primary-600" monospaced />
                  <div className="h-px bg-gray-200/50 dark:bg-gray-700/50"></div>
                  <InfoCard label="Bank Name" value={request.bank_name || 'N/A'} icon={Building2} color="text-primary-600" />
                  <div className="h-px bg-gray-200/50 dark:bg-gray-700/50"></div>
                  <InfoCard label="Bank Branch" value={request.bank_branch || 'N/A'} icon={MapPin} color="text-primary-600" />
                </div>

                <SectionLabel icon={Info} label="Additional Context" />
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Purpose of Request</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed italic">
                      "{request.description || 'No description provided.'}"
                    </p>
                  </div>
                  <div className="h-px bg-gray-200/50 dark:bg-gray-700/50"></div>
                  <InfoCard label="Timeline Required" value={formatDate(request.date_needed)} icon={Calendar} color="text-primary-600" />
                </div>
              </div>
            </div>

            {/* Workflow History Section */}
            {(request.verified_description || request.approved_description || request.payment_description || request.rejected_description) && (
              <div className="mt-8 space-y-4">
                <SectionLabel icon={Clock} label="Process History" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {request.verified_description && (
                    <HistoryItem 
                      label="Verification Notes" 
                      value={request.verified_description} 
                      user={request.verifier?.full_name} 
                      date={request.updated_at}
                      color="text-blue-600"
                      bg="bg-blue-50/50"
                    />
                  )}
                  {request.approved_description && (
                    <HistoryItem 
                      label="Approval Notes" 
                      value={request.approved_description} 
                      user={request.approver?.full_name} 
                      date={request.updated_at}
                      color="text-purple-600"
                      bg="bg-purple-50/50"
                    />
                  )}
                  {request.payment_description && (
                    <HistoryItem 
                      label="Settlement Notes" 
                      value={request.payment_description} 
                      user={request.payer?.full_name} 
                      date={request.updated_at}
                      color="text-amber-600"
                      bg="bg-amber-50/50"
                    />
                  )}
                  {request.rejected_description && (
                    <HistoryItem 
                      label="Rejection Reason" 
                      value={request.rejected_description} 
                      color="text-red-600"
                      bg="bg-red-50/50"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Receipt Preview (if any) */}
            {finalImageUrl && (
              <div className="mt-8">
                <SectionLabel icon={FileText} label="Attachment Proof" />
                <div 
                  className="mt-3 relative group rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-lg cursor-pointer"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <img
                    src={finalImageUrl}
                    alt="Receipt"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x400?text=Receipt+Not+Found';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-2 hover:scale-110 transition-transform">
                      <ExternalLink className="h-4 w-4" />
                      View Full Preview
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {request.status === 'pending' && canUpdateStatus && (
            <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden md:block">Verification Required</p>
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => {
                    onUpdateStatus(request.id, 'rejected');
                    onClose();
                  }}
                  className="flex-1 md:flex-none px-8 py-3.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Decline
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(request.id, 'approved');
                    onClose();
                  }}
                  className="flex-1 md:flex-none px-10 py-3.5 bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-900/20 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group"
                >
                  Authorize Request
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Image Preview Overlay */}
        <AnimatePresence>
          {isPreviewOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
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
                  src={finalImageUrl}
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

const SectionLabel = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <Icon className="h-4 w-4 text-gray-500" />
    </div>
    <span className="text-[11px] font-black text-gray-900 dark:text-gray-100 uppercase tracking-[0.2em]">{label}</span>
  </div>
);

const InfoCard = ({ label, value, subValue, icon: Icon, color = "text-primary-600", monospaced = false }) => (
  <div className="flex items-start gap-4">
    <div className={`p-2.5 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 ${color}`}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex flex-col">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`text-[13px] font-black text-gray-900 dark:text-gray-100 leading-tight ${monospaced ? 'font-mono tracking-tight' : ''}`}>
        {value}
      </p>
      {subValue && <p className="text-[10px] text-gray-500 font-medium italic mt-0.5">{subValue}</p>}
    </div>
  </div>
);

const HistoryItem = ({ label, value, user, date, color, bg }) => (
  <div className={`p-4 rounded-2xl border border-gray-100 dark:border-gray-800 ${bg} space-y-2`}>
    <div className="flex items-center justify-between">
      <p className={`text-[9px] font-black uppercase tracking-widest ${color}`}>{label}</p>
      {date && <p className="text-[8px] text-gray-400 font-medium">{new Date(date).toLocaleDateString()}</p>}
    </div>
    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
      "{value}"
    </p>
    {user && (
      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">
        By: {user}
      </p>
    )}
  </div>
);

export default RequestDetailsModal;
