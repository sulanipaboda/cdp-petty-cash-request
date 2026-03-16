// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    Filter,
    Search,
    Eye
} from 'lucide-react';
import { 
    fetchRequests, 
    updateRequestStatusLocally, 
    updateRequestStatusAsync,
    verifyPettyCash,
    approvePettyCash,
    updatePaymentStatusAsync
} from '../store/pettyCashSlice';
import RequestDetailsModal from './RequestDetailsModal';
import WorkflowActionModal from './WorkflowActionModal';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const dispatch = useDispatch();
    const requests = useSelector((state) => state.pettyCash.requests || []);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const currentUser = useSelector((state) => state.user.currentUser);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [workflowModal, setWorkflowModal] = useState({
        isOpen: false,
        type: '', // 'verification', 'approval', 'payment'
        requestId: null,
        title: '',
        placeholder: ''
    });
    const fetchStatus = useSelector((state) => state.pettyCash.status);

    // Permission check helper
    const hasPermission = (permissionName) => {
        if (!currentUser) return false;
        const roles = currentUser.roles || [];
        if (roles.some(role => role.name === 'Super Admin')) return true;
        return roles.some(role => 
            (role.permissions || []).some(p => p.name === permissionName)
        );
    };

    const canViewDetails = hasPermission('Petty Cash Index');
    const canUpdateStatus = hasPermission('Petty Cash Update Status');
    const canVerify = hasPermission('Petty Cash Verify');
    const canApprove = hasPermission('Petty Cash Approve');
    const canUpdatePayment = hasPermission('Petty Cash Update Payment Status');

    React.useEffect(() => {
        if (fetchStatus === 'idle') {
            dispatch(fetchRequests());
        }
    }, [fetchStatus, dispatch]);

    // Calculate statistics with safety checks
    const stats = {
        total: Array.isArray(requests) ? requests.length : 0,
        pending: Array.isArray(requests) ? requests.filter(r => r?.status === 'pending').length : 0,
        approved: Array.isArray(requests) ? requests.filter(r => r?.status === 'approved').length : 0,
        rejected: Array.isArray(requests) ? requests.filter(r => r?.status === 'rejected').length : 0,
    };

    const handleStatusUpdate = async (id, status) => {
        if (!canUpdateStatus) {
            toast.error("You don't have permission to update status");
            return;
        }
        try {
            await dispatch(updateRequestStatusAsync({ id, status })).unwrap();
            toast.success(`Request ${status} successfully!`);
        } catch (error) {
            toast.error(error.message || `Failed to update status`);
        }
    };

    const handleWorkflowAction = (requestId, type) => {
        const config = {
            verification: { title: 'Verify Request', placeholder: 'Add verification notes...' },
            approval: { title: 'Approve Request', placeholder: 'Add approval comments...' },
            payment: { title: 'Update Payment Status', placeholder: 'Add payment details...' }
        };

        setWorkflowModal({
            isOpen: true,
            type,
            requestId,
            ...config[type]
        });
    };

    const handleWorkflowSubmit = async (description) => {
        const { requestId, type } = workflowModal;
        try {
            if (type === 'verification') {
                await dispatch(verifyPettyCash({ id: requestId, status: 'verified', description })).unwrap();
            } else if (type === 'approval') {
                await dispatch(approvePettyCash({ id: requestId, status: 'approved', description })).unwrap();
            } else if (type === 'payment') {
                await dispatch(updatePaymentStatusAsync({ id: requestId, payment_status: 'paid', description })).unwrap();
            }
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
            setWorkflowModal({ ...workflowModal, isOpen: false });
        } catch (error) {
            toast.error(error.message || `Failed to update ${type}`);
        }
    };

    const filteredRequests = (Array.isArray(requests) ? requests : [])
        .filter(request => {
            if (filter !== 'all' && request.status !== filter) return false;
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (request.full_name || '').toLowerCase().includes(searchLower) ||
                    (request.branch_location || '').toLowerCase().includes(searchLower);
            }
            return true;
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { 
                bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
                text: 'text-yellow-800 dark:text-yellow-400', 
                icon: Clock 
            },
            approved: { 
                bg: 'bg-green-100 dark:bg-green-900/30', 
                text: 'text-green-800 dark:text-green-400', 
                icon: CheckCircle 
            },
            rejected: { 
                bg: 'bg-red-100 dark:bg-red-900/30', 
                text: 'text-red-800 dark:text-red-400', 
                icon: XCircle 
            },
        };
        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.bg} ${config.text} border border-transparent dark:border-white/5`}>
                <Icon className="h-3 w-3" />
                {status}
            </span>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Header */}
            {fetchStatus === 'loading' && (
                <div className="absolute top-4 right-4 text-primary-600 animate-pulse text-sm font-bold">
                    Loading data...
                </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tighter">Petty Cash Dashboard</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium italic">Monitor and manage all cash requests across branches.</p>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">Total Activity</span>
                        <span className="text-lg font-black text-gray-900 dark:text-gray-100 leading-tight">{stats.total} Requests</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Requests', value: stats.total, color: 'primary', icon: Filter },
                    { label: 'Pending Approval', value: stats.pending, color: 'yellow', icon: Clock },
                    { label: 'Approved Requests', value: stats.approved, color: 'green', icon: CheckCircle },
                    { label: 'Rejected Requests', value: stats.rejected, color: 'red', icon: XCircle },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    const colors = {
                        primary: 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/10',
                        yellow: 'border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10',
                        green: 'border-green-500 text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-900/10',
                        red: 'border-red-500 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10'
                    };
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-800 transition-all duration-300 group hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-none hover:-translate-y-1`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl transition-colors ${colors[stat.color]}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-5 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by candidate name, branch location or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 font-medium"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${filter === f
                                        ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none translate-y-[-1px]'
                                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Name</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Type</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-center">Verification</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-center">Approval</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-center">Payment</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] border-b border-gray-100 dark:border-gray-800">Status</th>
                                {(canViewDetails || canUpdateStatus) && (
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-right border-b border-gray-100 dark:border-gray-800">Operations</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            <AnimatePresence>
                                {filteredRequests.map((request, index) => (
                                    <motion.tr
                                        key={request.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50/50 dark:hover:bg-primary-900/5 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{request.created_at ? new Date(request.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : 'N/A'}</span>
                                                <span className="text-[10px] text-gray-400 font-medium uppercase">{request.created_at ? new Date(request.created_at).getFullYear() : 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold text-xs uppercase border border-gray-200 dark:border-gray-700">
                                                    {(request.full_name || 'User').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900 dark:text-gray-100 tracking-tight">{request.full_name || 'Unknown User'}</span>
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium italic">ID: {request.reference_number || `#REQ-${String(request.id || '').slice(-4)}`}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{(request.type || '').replace('_', ' ')}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleWorkflowAction(request.id, 'verification')}
                                                    disabled={!canVerify || request.status !== 'pending'}
                                                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${
                                                        canVerify && request.status === 'pending'
                                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800 hover:bg-blue-100 cursor-pointer'
                                                            : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 border-gray-100 dark:border-gray-800 cursor-not-allowed opacity-50'
                                                    }`}
                                                >
                                                    Verify
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleWorkflowAction(request.id, 'approval')}
                                                    disabled={!canApprove || request.status !== 'verified'}
                                                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${
                                                        canApprove && request.status === 'verified'
                                                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800 hover:bg-purple-100 cursor-pointer'
                                                            : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 border-gray-100 dark:border-gray-800 cursor-not-allowed opacity-50'
                                                    }`}
                                                >
                                                    Verify
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleWorkflowAction(request.id, 'payment')}
                                                    disabled={!canUpdatePayment || request.status !== 'approved'}
                                                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${
                                                        canUpdatePayment && request.status === 'approved'
                                                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800 hover:bg-amber-100 cursor-pointer'
                                                            : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 border-gray-100 dark:border-gray-800 cursor-not-allowed opacity-50'
                                                    }`}
                                                >
                                                    Verify
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">{getStatusBadge(request.status)}</td>
                                        {(canViewDetails || canUpdateStatus) && (
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end gap-1">
                                                    {canViewDetails && (
                                                        <button
                                                            onClick={() => setSelectedRequest(request)}
                                                            className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all"
                                                            title="View Full Profile"
                                                        >
                                                            <Eye className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    {canUpdateStatus && request.status === 'pending' && (
                                                        <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-1 rounded-xl ml-1 border border-gray-100 dark:border-gray-700">
                                                            <button
                                                                onClick={() => handleStatusUpdate(request.id, 'approved')}
                                                                className="p-1.5 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all"
                                                                title="Authorize"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                                                className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                                                                title="Dismiss"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {filteredRequests.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-3">
                                <Search className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                            </div>
                            <h3 className="text-gray-900 dark:text-gray-100 font-bold uppercase tracking-tight">Zero Results Found</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mt-1">Try adjusting your filters or search keywords to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Request Details Modal */}
            <RequestDetailsModal
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
                onUpdateStatus={handleStatusUpdate}
                canUpdateStatus={canUpdateStatus}
            />

            {/* Workflow Action Modal */}
            <WorkflowActionModal
                isOpen={workflowModal.isOpen}
                onClose={() => setWorkflowModal({ ...workflowModal, isOpen: false })}
                onSubmit={handleWorkflowSubmit}
                title={workflowModal.title}
                placeholder={workflowModal.placeholder}
            />
        </motion.div>
    );
};

export default Dashboard;