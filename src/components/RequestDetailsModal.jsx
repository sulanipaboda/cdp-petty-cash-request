// src/components/RequestDetailsModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, MapPin, Package, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const RequestDetailsModal = ({ request, onClose, onUpdateStatus }) => {
  if (!request) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 sticky top-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Request Details</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-primary-500 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              request.status === 'approved' ? 'bg-green-100 text-green-800' :
              request.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {request.status === 'approved' && <CheckCircle className="h-4 w-4" />}
              {request.status === 'rejected' && <XCircle className="h-4 w-4" />}
              {request.status === 'pending' && <Clock className="h-4 w-4" />}
              <span className="capitalize">{request.status}</span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem
                icon={Calendar}
                label="Request Date"
                value={formatDate(request.date)}
              />
              <DetailItem
                icon={User}
                label="Full Name"
                value={request.fullName}
              />
              <DetailItem
                icon={MapPin}
                label="Branch Location"
                value={request.branchLocation}
              />
              <DetailItem
                icon={Calendar}
                label="Date Needed"
                value={formatDate(request.dateNeeded)}
              />
            </div>

            {/* Request Type */}
            <div className="border-t pt-4">
              <DetailItem
                icon={FileText}
                label="Request Type"
                value={request.requestType}
              />
            </div>

            {/* Stationaries */}
            <div className="border-t pt-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Stationaries Needed</p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{request.stationaries}</p>
                </div>
              </div>
            </div>

            {/* Submission Info */}
            <div className="border-t pt-4">
              <p className="text-xs text-gray-500">
                Submitted on: {new Date(request.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          {request.status === 'pending' && (
            <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  onUpdateStatus(request.id, 'rejected');
                  onClose();
                }}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(request.id, 'approved');
                  onClose();
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon className="h-5 w-5 text-primary-600 mt-0.5" />
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-600">{value}</p>
    </div>
  </div>
);

export default RequestDetailsModal;