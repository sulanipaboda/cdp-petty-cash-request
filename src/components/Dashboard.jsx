// src/components/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    Filter,
    Search,
    Eye,
    ChevronLeft,
    ChevronRight,
    Wallet,
    Pencil
} from 'lucide-react';
import {
    fetchRequests,
    fetchSummary,
    updateRequestStatusLocally,
    updateRequestStatusAsync,
    verifyPettyCash,
    approvePettyCash,
    updatePaymentStatusAsync,
    updatePettyCash
} from '../store/pettyCashSlice';
import RequestDetailsModal from './RequestDetailsModal';
import WorkflowActionModal from './WorkflowActionModal';
import EditPettyCashModal from './EditPettyCashModal';
import Spinner from './common/Spinner';
import toast from 'react-hot-toast';

const PER_PAGE_OPTIONS = [15, 25, 50, 100];

const Dashboard = () => {
    const dispatch = useDispatch();
    const requests = useSelector((state) => state.pettyCash.requests || []);
    const meta = useSelector((state) => state.pettyCash.meta);
    const summary = useSelector((state) => state.pettyCash.summary);
    const fetchStatus = useSelector((state) => state.pettyCash.status);
    const currentUser = useSelector((state) => state.user.currentUser);

    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(15);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [editingRequest, setEditingRequest] = useState(null);
    const [workflowModal, setWorkflowModal] = useState({
        isOpen: false,
        type: '',
        requestId: null,
        title: '',
        placeholder: '',
        viewOnly: false,
        content: ''
    });

    // Debounce search input — waits 500ms after user stops typing
    const debounceTimer = useRef(null);
    useEffect(() => {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // reset to page 1 whenever search changes
        }, 500);
        return () => clearTimeout(debounceTimer.current);
    }, [searchTerm]);

    // Reset to page 1 when filter or perPage changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, perPage]);

    // Fetch paginated table data whenever page/perPage/search/filter changes
    useEffect(() => {
        dispatch(fetchRequests({ page: currentPage, perPage, search: debouncedSearch, status: filter }));
    }, [currentPage, perPage, debouncedSearch, filter, dispatch]);

    // Fetch global summary counts once on mount (and after any workflow action)
    useEffect(() => {
        dispatch(fetchSummary());
    }, [dispatch]);

    // Refresh summary after a workflow action completes
    const refreshSummary = () => dispatch(fetchSummary());

    // --- Permissions ---
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
    const canUpdate = hasPermission('Petty Cash Update');

    // --- Global stats from summary (across ALL pages) ---
    const stats = {
        total:    summary?.total    ?? (meta?.total ?? 0),
        pending:  summary?.pending  ?? 0,
        verified: summary?.verified ?? 0,
        approved: summary?.approved ?? 0,
        rejected: summary?.rejected ?? 0,
        settled:  summary?.settled  ?? 0,
    };

    const totalPages = meta?.lastPage ?? 1;

    // --- Handlers ---
    const handleStatusUpdate = async (id, status) => {
        if (!canUpdateStatus) {
            toast.error("You don't have permission to update status");
            return;
        }
        const request = requests.find(r => r.id === id);
        if (!request) return;
        try {
            if (status === 'approved' && request.status === 'verified') {
                await dispatch(approvePettyCash({ id, status: 'approved', description: 'Quick Authorize' })).unwrap();
            } else if (status === 'verified' && request.status === 'pending') {
                await dispatch(verifyPettyCash({ id, status: 'verified', description: 'Quick Verification' })).unwrap();
            } else {
                await dispatch(updateRequestStatusAsync({ id, status })).unwrap();
            }
            toast.success(`Request ${status} successfully!`);
            refreshSummary();
        } catch (error) {
            toast.error(error.message || `Failed to update status`);
        }
    };

    const handleWorkflowAction = (requestId, type, viewOnly = false) => {
        const request = requests.find(r => r.id === requestId);
        const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/v1\/?$/, '') || '';
        const receiptUrl = request?.receipt_image_path ? `${apiBase}/${request.receipt_image_path}`.replace(/([^:]\/)\/+/g, "$1") : null;
        const finalImageUrl = receiptUrl;

        const config = {
            verification: {
                title: viewOnly ? 'Verification Details' : 'Verify Request',
                placeholder: 'Add verification notes...',
                content: request?.verified_description || '',
                imageUrl: request?.type === 'reimbursement' ? finalImageUrl : null
            },
            approval: {
                title: viewOnly ? 'Approval Details' : 'Approve Request',
                placeholder: 'Add approval comments...',
                content: request?.approved_description || '',
                imageUrl: request?.type === 'reimbursement' ? finalImageUrl : null
            },
            payment: {
                title: viewOnly ? 'Settlement Details' : 'Update Payment Status',
                placeholder: 'Add payment details...',
                content: request?.payment_description || ''
            }
        };

        setWorkflowModal({ isOpen: true, type, requestId, viewOnly, ...config[type] });
    };

    const handleWorkflowSubmit = async (description, status = null) => {
        const { requestId, type } = workflowModal;
        try {
            if (type === 'verification') {
                await dispatch(verifyPettyCash({ id: requestId, status: status || 'verified', description })).unwrap();
            } else if (type === 'approval') {
                await dispatch(approvePettyCash({ id: requestId, status: status || 'approved', description })).unwrap();
            } else if (type === 'payment') {
                await dispatch(updatePaymentStatusAsync({ id: requestId, payment_status: status || 'paid', description })).unwrap();
            }
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
            setWorkflowModal({ ...workflowModal, isOpen: false });
            refreshSummary();
        } catch (error) {
            toast.error(error.message || `Failed to update ${type}`);
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredRequests = [...(Array.isArray(requests) ? requests : [])]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending:  { bg: 'bg-amber-100 dark:bg-amber-900/30',   text: 'text-amber-700 dark:text-amber-400',   icon: Clock },
            approved: { bg: 'bg-primary-100 dark:bg-primary-900/30', text: 'text-primary-700 dark:text-primary-400', icon: CheckCircle },
            verified: { bg: 'bg-blue-100 dark:bg-blue-900/30',    text: 'text-blue-700 dark:text-blue-400',    icon: CheckCircle },
            rejected: { bg: 'bg-red-100 dark:bg-red-900/30',      text: 'text-red-700 dark:text-red-400',      icon: XCircle },
            paid:     { bg: 'bg-teal-100 dark:bg-teal-900/30',    text: 'text-teal-700 dark:text-teal-400',    icon: Wallet },
        };
        const config = statusConfig[status] || statusConfig.pending;
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
            {/* Loading overlay */}
            {fetchStatus === 'loading' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <Spinner size="lg" />
                </div>
            )}

            {/* Header */}
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

            {/* Stats Cards — 6 cards using global summary (all pages) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { label: 'Total',    value: stats.total,    color: 'primary', icon: Filter },
                    { label: 'Pending',  value: stats.pending,  color: 'yellow',  icon: Clock },
                    { label: 'Verified', value: stats.verified, color: 'blue',    icon: CheckCircle },
                    { label: 'Approved', value: stats.approved, color: 'primary', icon: CheckCircle },
                    { label: 'Rejected', value: stats.rejected, color: 'red',     icon: XCircle },
                    { label: 'Settled',  value: stats.settled,  color: 'teal',    icon: Wallet },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    const colors = {
                        primary: 'border-primary-400 text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/10',
                        yellow:  'border-yellow-400  text-yellow-600  dark:text-yellow-400  bg-yellow-50/50  dark:bg-yellow-900/10',
                        blue:    'border-blue-400    text-blue-600    dark:text-blue-400    bg-blue-50/50    dark:bg-blue-900/10',
                        red:     'border-red-400     text-red-600     dark:text-red-400     bg-red-50/50     dark:bg-red-900/10',
                        teal:    'border-teal-400    text-teal-600    dark:text-teal-400    bg-teal-50/50    dark:bg-teal-900/10',
                    };
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.07 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-none hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-2.5 rounded-xl transition-colors border ${colors[stat.color]}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by respondent name, branch or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 font-medium"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden lg:block"></div>
                        <div className="flex flex-wrap gap-2">
                            {['all', 'pending', 'verified', 'approved', 'rejected', 'paid'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${filter === f
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
            </div>

            {/* Requests Table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Full Name</th>
                                <th className="px-4 py-3 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Request Type</th>
                                <th className="px-4 py-3 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-center">Verification</th>
                                <th className="px-4 py-3 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-center">Approval</th>
                                <th className="px-4 py-3 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-center">Payment</th>
                                <th className="px-4 py-3 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Status</th>
                                {(canViewDetails || canUpdateStatus || canUpdate) && (
                                    <th className="px-4 py-3 text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-right">Operations</th>
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
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-gray-50/50 dark:hover:bg-primary-900/5 transition-colors group"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary-600 font-bold text-[10px] uppercase border border-gray-200 dark:border-gray-700">
                                                    {(request.full_name || 'User').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-gray-900 dark:text-gray-100 tracking-tight">{request.full_name || 'Unknown User'}</span>
                                                    <span className="text-[9px] text-primary-600/60 dark:text-primary-400/60 font-medium italic uppercase tracking-tighter leading-none mt-0.5">ID: {request.reference_number || `#REQ-${String(request.id || '').slice(-4)}`}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">{(request.type || '').replace('_', ' ')}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center">
                                                {request.verification_status === 'verified' || request.status === 'verified' || request.status === 'approved' || request.status === 'paid' ? (
                                                    <button
                                                        onClick={() => handleWorkflowAction(request.id, 'verification', true)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all"
                                                    >
                                                        <CheckCircle className="h-3 w-3" />
                                                        Done
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleWorkflowAction(request.id, 'verification')}
                                                        disabled={!canVerify || request.status !== 'pending'}
                                                        className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border transition-all ${canVerify && request.status === 'pending'
                                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800 hover:bg-blue-100 cursor-pointer'
                                                            : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 border-gray-100 dark:border-gray-800 cursor-not-allowed opacity-50'
                                                            }`}
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center">
                                                {request.approval_status === 'approved' || request.status === 'approved' || request.status === 'paid' ? (
                                                    <button
                                                        onClick={() => handleWorkflowAction(request.id, 'approval', true)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-purple-100 transition-all"
                                                    >
                                                        <CheckCircle className="h-3 w-3" />
                                                        Done
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleWorkflowAction(request.id, 'approval')}
                                                        disabled={!canApprove || request.status !== 'verified'}
                                                        className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border transition-all ${canApprove && request.status === 'verified'
                                                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800 hover:bg-purple-100 cursor-pointer'
                                                            : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 border-gray-100 dark:border-gray-800 cursor-not-allowed opacity-50'
                                                            }`}
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center">
                                                {request.payment_status === 'paid' || request.status === 'paid' ? (
                                                    <button
                                                        onClick={() => handleWorkflowAction(request.id, 'payment', true)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all"
                                                    >
                                                        <CheckCircle className="h-3 w-3" />
                                                        Done
                                                    </button>
                                                ) : request.payment_status === 'onhold' ? (
                                                    <button
                                                        onClick={() => handleWorkflowAction(request.id, 'payment')}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                                                    >
                                                        <Clock className="h-3 w-3" />
                                                        On Hold
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleWorkflowAction(request.id, 'payment')}
                                                        disabled={!canUpdatePayment || (request.status !== 'approved' && request.status !== 'verified')}
                                                        className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border transition-all ${canUpdatePayment && (request.status === 'approved' || request.status === 'verified')
                                                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800 hover:bg-amber-100 cursor-pointer'
                                                            : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600 border-gray-100 dark:border-gray-800 cursor-not-allowed opacity-50'
                                                            }`}
                                                    >
                                                        Settlement
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{getStatusBadge(request.status)}</td>
                                        {(canViewDetails || canUpdateStatus || canUpdate) && (
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    {canUpdate && (
                                                        <button
                                                            onClick={() => setEditingRequest(request)}
                                                            className="p-2 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all"
                                                            title="Edit Record (Super User)"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                    )}
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
                                                                className="p-1.5 text-primary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-all"
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

                    {filteredRequests.length === 0 && fetchStatus !== 'loading' && (
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

            {/* Pagination */}
            {totalPages >= 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm px-6 py-4 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                            Page <span className="text-gray-900 dark:text-gray-100">{currentPage}</span> of{' '}
                            <span className="text-gray-900 dark:text-gray-100">{totalPages}</span>
                            {meta?.total ? (
                                <span className="ml-2 text-gray-400">&mdash; {meta.total} records {filter !== 'all' || debouncedSearch ? '(filtered)' : 'total'}</span>
                            ) : null}
                        </p>
                        {/* Per-page selector in pagination bar */}
                        <select
                            value={perPage}
                            onChange={(e) => setPerPage(Number(e.target.value))}
                            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
                        >
                            {PER_PAGE_OPTIONS.map(n => (
                                <option key={n} value={n}>Show {n}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || fetchStatus === 'loading'}
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                            .reduce((acc, p, idx, arr) => {
                                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((p, idx) =>
                                p === '...' ? (
                                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => handlePageChange(p)}
                                        disabled={fetchStatus === 'loading'}
                                        className={`min-w-[36px] h-9 px-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                                            currentPage === p
                                                ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none'
                                                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || fetchStatus === 'loading'}
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

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
                type={workflowModal.type}
                title={workflowModal.title}
                placeholder={workflowModal.placeholder}
                viewOnly={workflowModal.viewOnly}
                content={workflowModal.content}
                imageUrl={workflowModal.imageUrl}
            />

            {/* Edit Petty Cash Modal (Super User) */}
            {editingRequest && (
                <EditPettyCashModal
                    request={editingRequest}
                    onClose={() => setEditingRequest(null)}
                    onSaved={() => {
                        dispatch(fetchSummary());
                        setEditingRequest(null);
                    }}
                />
            )}
        </motion.div>
    );
};

export default Dashboard;