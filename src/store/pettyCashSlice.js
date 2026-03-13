// src/store/pettyCashSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchRequests = createAsyncThunk('pettyCash/fetchRequests', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/petty-cashes');
        // Extract data based on Laravel pagination structure
        return response.data.data?.data || response.data.data || response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchCategories = createAsyncThunk('pettyCash/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/categories/list');
        // Handle Laravel response: { data: [...] } or { data: { data: [...] } }
        const categories = response.data.data?.data || response.data.data || response.data;
        return Array.isArray(categories) ? categories : [];
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

const initialState = {
    categories: [],
    requests: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
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
            // Fetch Requests
            .addCase(fetchRequests.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRequests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.requests = action.payload;
            })
            .addCase(fetchRequests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Fetch Categories
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            // Submit Request
            .addCase(submitRequest.fulfilled, (state, action) => {
                state.requests.unshift(action.payload);
            })
            // Update Status
            .addCase(updateRequestStatusAsync.fulfilled, (state, action) => {
                const updatedRequest = action.payload;
                const index = state.requests.findIndex(r => r.id === updatedRequest.id);
                if (index !== -1) {
                    state.requests[index] = updatedRequest;
                }
            });
    },
});

export const { updateRequestStatusLocally } = pettyCashSlice.actions;
export default pettyCashSlice.reducer;