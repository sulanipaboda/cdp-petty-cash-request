// src/store/pettyCashSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchRequests = createAsyncThunk('pettyCash/fetchRequests', async ({ page = 1, perPage = 15, search = '', status = '' } = {}, { rejectWithValue }) => {
    try {
        const params = new URLSearchParams({ page, per_page: perPage });
        if (search) params.set('search', search);
        if (status && status !== 'all') params.set('status', status);
        const response = await api.get(`/petty-cashes?${params}`);
        // Handle Laravel pagination structure
        const paginated = response.data.data;
        if (paginated && paginated.data) {
            return {
                data: paginated.data,
                meta: {
                    total: paginated.total || 0,
                    currentPage: paginated.current_page || 1,
                    lastPage: paginated.last_page || 1,
                    perPage: paginated.per_page || perPage,
                }
            };
        }
        // Fallback for non-paginated responses
        const data = response.data.data || response.data;
        return { data: Array.isArray(data) ? data : [], meta: null };
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Fetch summary counts across ALL records (not page-restricted)
export const fetchSummary = createAsyncThunk('pettyCash/fetchSummary', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/petty-cashes?per_page=9999&page=1');
        const paginated = response.data.data;
        const allData = paginated?.data || (Array.isArray(response.data.data) ? response.data.data : []);
        return {
            total: paginated?.total ?? allData.length,
            pending: allData.filter(r => r.status === 'pending').length,
            verified: allData.filter(r => r.status === 'verified').length,
            approved: allData.filter(r => r.status === 'approved').length,
            rejected: allData.filter(r => r.status === 'rejected').length,
            settled: allData.filter(r => r.payment_status === 'paid' || r.status === 'paid').length,
        };
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchCategories = createAsyncThunk('pettyCash/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/categories/public/list');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchBranches = createAsyncThunk('pettyCash/fetchBranches', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/branches/public/list');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchDepartments = createAsyncThunk('pettyCash/fetchDepartments', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/departments/public/list');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});


export const submitRequest = createAsyncThunk('pettyCash/submitRequest', async (formData, { rejectWithValue }) => {
    try {
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };
        const response = await api.post('/petty-cashes', formData, config);
        return response.data.data || response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const updateRequestStatusAsync = createAsyncThunk('pettyCash/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/petty-cashes/${id}/status`, { status });
        return response.data.data || response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const verifyPettyCash = createAsyncThunk('pettyCash/verify', async ({ id, status, description }, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/petty-cashes/${id}/verify`, { status, description });
        return response.data.data || response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const approvePettyCash = createAsyncThunk('pettyCash/approve', async ({ id, status, description }, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/petty-cashes/${id}/approve`, { status, description });
        return response.data.data || response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const updatePaymentStatusAsync = createAsyncThunk('pettyCash/updatePaymentStatus', async ({ id, payment_status, description }, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/petty-cashes/${id}/payment-status`, { payment_status, description });
        return response.data.data || response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// Super-user update: PUT /petty-cashes/{id} — all fields editable
export const updatePettyCash = createAsyncThunk('pettyCash/update', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const response = await api.post(`/petty-cashes/${id}?_method=PUT`, formData, config);
        return response.data.data || response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    categories: [],
    branches: [],
    departments: [],
    requests: [],
    meta: null,    // pagination metadata: { total, currentPage, lastPage, perPage }
    summary: null, // global counts across all records: { total, pending, verified, approved, rejected, settled }
    status: 'idle',        // 'idle' | 'loading' | 'succeeded' | 'failed'
    summaryStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    submitStatus: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
    updateStatus: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};


const pettyCashSlice = createSlice({
    name: 'pettyCash',
    initialState,
    reducers: {
        updateRequestStatusLocally: (state, action) => {
            const { id, status } = action.payload;
            const request = state.requests.find(r => r.id === id);
            if (request) {
                request.status = status;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Requests (paginated table)
            .addCase(fetchRequests.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.requests = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(fetchRequests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Fetch Summary (global counts)
            .addCase(fetchSummary.pending, (state) => {
                state.summaryStatus = 'loading';
            })
            .addCase(fetchSummary.fulfilled, (state, action) => {
                state.summaryStatus = 'succeeded';
                state.summary = action.payload;
            })
            .addCase(fetchSummary.rejected, (state) => {
                state.summaryStatus = 'failed';
            })
            // Fetch Categories
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            // Fetch Branches
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.branches = action.payload;
            })
            // Fetch Departments
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.departments = action.payload;
            })
            // Submit Request
            .addCase(submitRequest.pending, (state) => {
                state.submitStatus = 'loading';
            })
            .addCase(submitRequest.fulfilled, (state, action) => {
                state.submitStatus = 'succeeded';
                state.requests.unshift(action.payload);
            })
            .addCase(submitRequest.rejected, (state, action) => {
                state.submitStatus = 'failed';
                state.error = action.payload;
            })
            // Update Status
            .addCase(updateRequestStatusAsync.fulfilled, (state, action) => {
                const updatedRequest = action.payload;
                const index = state.requests.findIndex(r => r.id === updatedRequest.id);
                if (index !== -1) {
                    state.requests[index] = updatedRequest;
                }
            })
            // Verify
            .addCase(verifyPettyCash.fulfilled, (state, action) => {
                const updatedRequest = action.payload;
                const index = state.requests.findIndex(r => r.id === updatedRequest.id);
                if (index !== -1) {
                    state.requests[index] = updatedRequest;
                }
            })
            // Approve
            .addCase(approvePettyCash.fulfilled, (state, action) => {
                const updatedRequest = action.payload;
                const index = state.requests.findIndex(r => r.id === updatedRequest.id);
                if (index !== -1) {
                    state.requests[index] = updatedRequest;
                }
            })
            // Payment Status
            .addCase(updatePaymentStatusAsync.fulfilled, (state, action) => {
                const updatedRequest = action.payload;
                const index = state.requests.findIndex(r => r.id === updatedRequest.id);
                if (index !== -1) {
                    state.requests[index] = updatedRequest;
                }
            })
            // Super-user Update
            .addCase(updatePettyCash.pending, (state) => {
                state.updateStatus = 'loading';
            })
            .addCase(updatePettyCash.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                const updatedRequest = action.payload;
                const index = state.requests.findIndex(r => r.id === updatedRequest.id);
                if (index !== -1) {
                    state.requests[index] = updatedRequest;
                }
            })
            .addCase(updatePettyCash.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.error = action.payload;
            });
    },
});

export const { updateRequestStatusLocally } = pettyCashSlice.actions;
export default pettyCashSlice.reducer;