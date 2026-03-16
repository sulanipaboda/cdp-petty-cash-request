import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchDepartments = createAsyncThunk('department/fetchDepartments', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/departments');
    return response.data.data?.data || response.data.data || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createDepartment = createAsyncThunk('department/createDepartment', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/departments', data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateDepartment = createAsyncThunk('department/updateDepartment', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/departments/${id}`, data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteDepartment = createAsyncThunk('department/deleteDepartment', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/departments/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const toggleDepartmentStatus = createAsyncThunk('department/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/departments/${id}/toggle-status`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const initialState = {
  departments: [],
  status: 'idle',
  error: null,
};

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departments.unshift(action.payload);
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const index = state.departments.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.departments[index] = action.payload;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.filter((d) => d.id !== action.payload);
      })
      .addCase(toggleDepartmentStatus.fulfilled, (state, action) => {
        const index = state.departments.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.departments[index].is_active = action.payload.is_active;
        }
      });
  },
});

export default departmentSlice.reducer;
