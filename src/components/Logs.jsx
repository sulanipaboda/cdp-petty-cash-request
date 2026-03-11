import React from 'react';
import { useSelector } from 'react-redux';
import DataTable from './common/DataTable';
import { Terminal } from 'lucide-react';

const Logs = () => {
  const auditLogs = useSelector((state) => state.user.auditLogs);

  const columns = [
    { 
      header: 'Date & Time', 
      key: 'timestamp',
      render: (val) => <span className="text-gray-900 dark:text-gray-100 font-medium">{val}</span>
    },
    { header: 'User', key: 'user' },
    { 
      header: 'Action', 
      key: 'action',
      render: (val) => (
        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs font-bold uppercase tracking-wider">
          {val}
        </span>
      )
    },
    { header: 'Module', key: 'module' },
    { 
      header: 'Status', 
      key: 'status',
      render: (status) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          status === 'Success' 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        }`}>
          {status}
        </span>
      )
    },
    { header: 'IP Address', key: 'ipAddress' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-900 dark:bg-primary-600 rounded-xl shadow-lg transition-colors">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">Audit Logs</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Track all administrative actions and system events.</p>
          </div>
        </div>
      </div>

      <DataTable 
        title="System Activity Stream"
        data={auditLogs}
        columns={columns}
        searchPlaceholder="Search logs by user, action or module..."
      />
    </div>
  );
};

export default Logs;
