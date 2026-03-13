import { useLocation, BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store/store';
import { fetchCurrentUser, fetchUsers, fetchRoles, fetchPermissions } from './store/userSlice';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

// Components
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Roles from './components/Roles';
import Permissions from './components/Permissions';
import Logs from './components/Logs';
import PettyCashForm from './components/PettyCashForm';
import PublicNavigation from './components/PublicNavigation';
import Login from './components/Login';

function AppContent() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const authStatus = useSelector((state) => state.user.authStatus);
  const dataStatus = useSelector((state) => state.user.dataStatus);
  const theme = useSelector((state) => state.user.theme);
  const location = useLocation();
  const isPublicRoute = location.pathname.startsWith('/public');
  const isLoginRoute = location.pathname === '/login';

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !currentUser && authStatus === 'idle') {
       dispatch(fetchCurrentUser());
    }
  }, [dispatch, currentUser, authStatus]);

  useEffect(() => {
    if (currentUser && dataStatus === 'idle') {
      dispatch(fetchUsers());
      dispatch(fetchRoles());
      dispatch(fetchPermissions());
    }
  }, [dispatch, currentUser, dataStatus]);

  // Handle loading state gracefully
  if (authStatus === 'loading' && !isPublicRoute && !isLoginRoute) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-primary-600 font-bold animate-pulse">Loading Application...</div>
      </div>
    );
  }

  if (isLoginRoute) {
    return (
      <>
        <Login />
        <Toaster position="top-right" />
      </>
    );
  }

  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <PublicNavigation />
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Routes>
            <Route path="/public/request" element={<PettyCashForm />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  if (!currentUser && authStatus !== 'loading') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto md:pl-64 transition-all duration-300">
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/permissions" element={<Permissions />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/public/request" replace />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;