import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchBranches = createAsyncThunk('branch/fetchBranches', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/branches');
    return response.data.data?.data || response.data.data || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createBranch = createAsyncThunk('branch/createBranch', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/branches', data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateBranch = createAsyncThunk('branch/updateBranch', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/branches/${id}`, data);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteBranch = createAsyncThunk('branch/deleteBranch', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/branches/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const toggleBranchStatus = createAsyncThunk('branch/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/branches/${id}/toggle-status`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const initialState = {
  branches: [],
  status: 'idle',
  error: null,
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.branches.unshift(action.payload);
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        const index = state.branches.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.branches[index] = action.payload;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.branches = state.branches.filter((b) => b.id !== action.payload);
      })
      .addCase(toggleBranchStatus.fulfilled, (state, action) => {
        const index = state.branches.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.branches[index].is_active = action.payload.is_active;
        }
      });
  },
});

export default branchSlice.reducer;
