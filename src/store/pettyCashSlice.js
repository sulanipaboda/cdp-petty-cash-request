// src/store/pettyCashSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchRequests = createAsyncThunk('pettyCash/fetchRequests', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/petty-cashes');
        // Extract the array from Laravel's paginated response structure (data.data)
        return response.data.data?.data || response.data.data || response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const submitRequest = createAsyncThunk('pettyCash/submitRequest', async (requestData, { rejectWithValue }) => {
    try {
        const response = await api.post('/petty-cashes', requestData);
        // Assuming API returns the created object
        return response.data.data || response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
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
            // Submit Request
            .addCase(submitRequest.fulfilled, (state, action) => {
                state.requests.unshift(action.payload);
            });
    },
});

export const { updateRequestStatusLocally } = pettyCashSlice.actions;
export default pettyCashSlice.reducer;