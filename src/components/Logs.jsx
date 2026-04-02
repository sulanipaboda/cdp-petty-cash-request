import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from './common/Spinner';
import DataTable from './common/DataTable';
import { Terminal } from 'lucide-react';
import { fetchAuditLogs } from '../store/userSlice';

const Logs = () => {
  const auditLogs = useSelector((state) => state.user.auditLogs || []);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  const columns = [
    { 
      header: 'Date & Time', 
      key: 'created_at',
      render: (val) => <span className="text-gray-900 dark:text-gray-100 font-medium">{val ? new Date(val).toLocaleString() : 'N/A'}</span>
    },
    { 
      header: 'User', 
      key: 'user',
      render: (user) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 dark:text-gray-100">{user?.name || 'System'}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{user?.email || ''}</span>
        </div>
      )
    },
    { 
      header: 'Action', 
      key: 'action',
      render: (val) => (
        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-[10px] font-black uppercase tracking-wider">
          {val}
        </span>
      )
    },
    { header: 'Module', key: 'module' },
    { 
      header: 'IP Address', 
      key: 'ip_address',
      render: (val) => <code className="text-[10px] font-mono text-gray-400">{val || '0.0.0.0'}</code>
    },
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

      {useSelector(state => state.user.dataStatus) === 'loading' ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <DataTable 
          title="System Activity Stream"
          data={auditLogs}
          columns={columns}
          searchPlaceholder="Search logs by user, action or module..."
        />
      )}
    </div>
  );
};

export default Logs;
