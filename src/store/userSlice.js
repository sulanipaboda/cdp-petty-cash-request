// src/store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [
    { id: '1', name: 'Admin User', email: 'admin@cdp.com', role: 'System Administrator', status: 'Active', createdAt: '2024-01-15' },
    { id: '2', name: 'Finance Manager', email: 'finance@cdp.com', role: 'Finance Manager', status: 'Active', createdAt: '2024-01-20' },
    { id: '3', name: 'Branch Officer', email: 'officer@cdp.com', role: 'Branch Officer', status: 'Inactive', createdAt: '2024-02-05' },
    { id: '4', name: 'HR Executive', email: 'hr@cdp.com', role: 'HR Manager', status: 'Active', createdAt: '2024-03-01' },
    { id: '5', name: 'IT Support', email: 'it@cdp.com', role: 'IT Administrator', status: 'Active', createdAt: '2024-03-10' },
  ],
  roles: [
    { id: '1', name: 'System Administrator', description: 'Full system access', userCount: 1, status: 'Active' },
    { id: '2', name: 'Finance Manager', description: 'Approval and reporting access', userCount: 1, status: 'Active' },
    { id: '3', name: 'Branch Officer', description: 'Request submission access', userCount: 1, status: 'Active' },
    { id: '4', name: 'HR Manager', description: 'HR related access', userCount: 1, status: 'Active' },
  ],
  permissions: [
    { id: '1', module: 'Requests', action: 'Create', description: 'Submit new petty cash requests' },
    { id: '2', module: 'Requests', action: 'Approve', description: 'Approve or reject requests' },
    { id: '3', module: 'Users', action: 'Manage', description: 'Full user management' },
    { id: '4', module: 'System', action: 'Configure', description: 'System settings' },
  ],
  auditLogs: [
    { id: '1', timestamp: '2024-03-11 10:30:15', user: 'Admin User', action: 'Created User', module: 'User Management', status: 'Success', ipAddress: '192.168.1.1' },
    { id: '2', timestamp: '2024-03-11 11:15:22', user: 'Finance Manager', action: 'Approved Request', module: 'Petty Cash', status: 'Success', ipAddress: '192.168.1.5' },
    { id: '3', timestamp: '2024-03-11 12:05:45', user: 'Admin User', action: 'Updated Role', module: 'Role Management', status: 'Success', ipAddress: '192.168.1.1' },
    { id: '4', timestamp: '2024-03-11 14:20:10', user: 'Branch Officer', action: 'Failed Login', module: 'Authentication', status: 'Failed', ipAddress: '192.168.1.12' },
    { id: '5', timestamp: '2024-03-11 15:整点:00', user: 'Admin User', action: 'Deleted Permission', module: 'Permission Management', status: 'Success', ipAddress: '192.168.1.1' },
    { id: '6', timestamp: '2024-03-11 15:45:30', user: 'HR Executive', action: 'Created User', module: 'User Management', status: 'Success', ipAddress: '192.168.1.8' },
    { id: '7', timestamp: '2024-03-11 16:10:15', user: 'System Administrator', action: 'Configured SMTP', module: 'System Settings', status: 'Success', ipAddress: '10.0.0.1' },
    { id: '8', timestamp: '2024-03-11 16:55:40', user: 'Finance Manager', action: 'Rejected Request', module: 'Petty Cash', status: 'Success', ipAddress: '192.168.1.5' },
    { id: '9', timestamp: '2024-03-11 17:05:12', user: 'Admin User', action: 'Created Role', module: 'Role Management', status: 'Success', ipAddress: '192.168.1.1' },
    { id: '10', timestamp: '2024-03-11 17:15:45', user: 'IT Support', action: 'Reset Password', module: 'User Management', status: 'Success', ipAddress: '192.168.1.10' },
  ],
  currentUser: {
    id: '1',
    name: 'Admin User',
    role: 'System Administrator',
    email: 'admin@cdp.com',
    avatar: null
  },
  theme: 'light',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
    // Users
    addUser: (state, action) => {
      state.users.push({ ...action.payload, id: Date.now().toString() });
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) state.users[index] = action.payload;
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
    // Roles
    addRole: (state, action) => {
      state.roles.push({ ...action.payload, id: Date.now().toString() });
    },
    updateRole: (state, action) => {
      const index = state.roles.findIndex(r => r.id === action.payload.id);
      if (index !== -1) state.roles[index] = action.payload;
    },
    deleteRole: (state, action) => {
      state.roles = state.roles.filter(r => r.id !== action.payload);
    },
    // Permissions
    addPermission: (state, action) => {
      state.permissions.push({ ...action.payload, id: Date.now().toString() });
    },
    updatePermission: (state, action) => {
      const index = state.permissions.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.permissions[index] = action.payload;
    },
    deletePermission: (state, action) => {
      state.permissions = state.permissions.filter(p => p.id !== action.payload);
    },
  },
});

export const { 
  addUser, updateUser, deleteUser,
  addRole, updateRole, deleteRole,
  addPermission, updatePermission, deletePermission,
  setTheme, logout
} = userSlice.actions;

export default userSlice.reducer;
