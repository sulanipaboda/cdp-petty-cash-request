// src/store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const loginUser = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/login', credentials);
    const data = response.data.data;
    const token = data.auth_token || data.access_token || response.data.access_token || response.data.token;
    if (token) {
      localStorage.setItem('access_token', token);
    }
    // Return the user object from the nested data structure
    return data.user || response.data.user || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const logoutUser = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/logout');
    localStorage.removeItem('access_token');
    return null;
  } catch (error) {
    // Even if backend fails, clear local session
    localStorage.removeItem('access_token');
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchCurrentUser = createAsyncThunk('user/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/me');
    // Extract user from response.data.data.user
    return response.data.data?.user || response.data.data || response.data;
  } catch (error) {
    localStorage.removeItem('access_token');
    return rejectWithValue(error.response?.data || error.message);
  }
});
export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users');
    // Extract array from Laravel paginated response structure
    return response.data.data?.data || response.data.data || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createUser = createAsyncThunk('user/createUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/users', userData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateUserAsync = createAsyncThunk('user/updateUser', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteUserAsync = createAsyncThunk('user/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/users/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const toggleUserStatus = createAsyncThunk('user/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});


export const fetchRoles = createAsyncThunk('user/fetchRoles', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/roles');
    // Extract array from Laravel paginated response structure
    return response.data.data?.data || response.data.data || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createRole = createAsyncThunk('user/createRole', async (roleData, { rejectWithValue }) => {
  try {
    const response = await api.post('/roles', roleData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateRoleAsync = createAsyncThunk('user/updateRole', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/roles/${id}`, data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteRoleAsync = createAsyncThunk('user/deleteRole', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/roles/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchPermissions = createAsyncThunk('user/fetchPermissions', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/permissions/list');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});


export const createPermission = createAsyncThunk('user/createPermission', async (permissionData, { rejectWithValue }) => {
  try {
    const response = await api.post('/permissions', permissionData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updatePermissionAsync = createAsyncThunk('user/updatePermission', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/permissions/${id}`, data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deletePermissionAsync = createAsyncThunk('user/deletePermission', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/permissions/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchAuditLogs = createAsyncThunk('user/fetchAuditLogs', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/activity-logs');
    // Extract array from Laravel paginated response structure
    return response.data.data?.data || response.data.data || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const initialState = {
  users: [],
  roles: [],
  permissions: [],
  auditLogs: [],
  currentUser: null,
  authStatus: 'idle',
  authError: null,
  dataStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
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
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.authStatus = 'loading';
        state.authError = null;
    })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authStatus = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authStatus = 'failed';
        state.authError = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.authStatus = 'idle';
      })
      .addCase(logoutUser.rejected, (state) => {
        state.currentUser = null;
        state.authStatus = 'idle';
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.authStatus = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.authStatus = 'succeeded';
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.authStatus = 'failed';
        state.currentUser = null;
      })
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.dataStatus = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.dataStatus = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.dataStatus = 'failed';
      })
      // Create User
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      // Update User
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
      })
      // Delete User
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      })
      // Toggle User Status
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index].is_active = action.payload.is_active;
        }
      })
      // Fetch Roles

      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      })
      // Create Role
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      // Update Role
      .addCase(updateRoleAsync.fulfilled, (state, action) => {
        const index = state.roles.findIndex(r => r.id === action.payload.id);
        if (index !== -1) state.roles[index] = action.payload;
      })
      // Delete Role
      .addCase(deleteRoleAsync.fulfilled, (state, action) => {
        state.roles = state.roles.filter(r => r.id !== action.payload);
      })
      // Fetch Permissions
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
      })
      // Create Permission
      .addCase(createPermission.fulfilled, (state, action) => {
        state.permissions.push(action.payload);
      })
      // Update Permission
      .addCase(updatePermissionAsync.fulfilled, (state, action) => {
        const index = state.permissions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.permissions[index] = action.payload;
      })
      // Delete Permission
      .addCase(deletePermissionAsync.fulfilled, (state, action) => {
        state.permissions = state.permissions.filter(p => p.id !== action.payload);
      })
      // Audit Logs
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.auditLogs = action.payload;
      });
  },
});

export const { 
  addUser, updateUser, deleteUser,
  addRole, updateRole, deleteRole,
  addPermission, updatePermission, deletePermission,
  setTheme, logout
} = userSlice.actions;

export default userSlice.reducer;
