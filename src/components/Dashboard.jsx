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
import { updateRequestStatus } from '../store/pettyCashSlice';
import RequestDetailsModal from './RequestDetailsModal';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const dispatch = useDispatch();
    const requests = useSelector((state) => state.pettyCash.requests);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Calculate statistics
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
    };

    const handleStatusUpdate = (id, status) => {
        dispatch(updateRequestStatus({ id, status }));
        toast.success(`Request ${status} successfully!`);
    };

    const filteredRequests = requests
        .filter(request => {
            if (filter !== 'all' && request.status !== filter) return false;
            if (searchTerm) {
                return request.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    request.branchLocation.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return true;
        })
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
            approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
        };
        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon className="h-3 w-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Petty Cash Dashboard</h1>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                    <span className="text-sm font-medium text-gray-600">Total Requests: {stats.total}</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Requests', value: stats.total, color: 'primary', icon: Filter },
                    { label: 'Pending', value: stats.pending, color: 'yellow', icon: Clock },
                    { label: 'Approved', value: stats.approved, color: 'green', icon: CheckCircle },
                    { label: 'Rejected', value: stats.rejected, color: 'red', icon: XCircle },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white rounded-xl shadow-sm p-6 border-l-4 border-${stat.color}-500`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <Icon className={`h-8 w-8 text-${stat.color}-500 opacity-50`} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'pending', 'approved', 'rejected'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Needed</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <AnimatePresence>
                                {filteredRequests.map((request, index) => (
                                    <motion.tr
                                        key={request.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900">{new Date(request.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.fullName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{request.branchLocation}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(request.dateNeeded).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{request.requestType}</td>
                                        <td className="px-6 py-4 text-sm">{getStatusBadge(request.status)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedRequest(request)}
                                                    className="p-1 text-gray-600 hover:text-primary-600 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                {request.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(request.id, 'approved')}
                                                            className="p-1 text-green-600 hover:text-green-700 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                                            className="p-1 text-red-600 hover:text-red-700 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {filteredRequests.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No requests found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Request Details Modal */}
            <RequestDetailsModal
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
                onUpdateStatus={handleStatusUpdate}
            />
        </motion.div>
    );
};

export default Dashboard;