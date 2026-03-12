// src/store/pettyCashSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: [
        { id: 'cat1', name: 'Stationery' },
        { id: 'cat2', name: 'Travel' },
        { id: 'cat3', name: 'Meals' },
        { id: 'cat4', name: 'Utilities' },
        { id: 'cat5', name: 'Miscellaneous' },
    ],
    requests: [
        {
            id: '1',
            referenceNumber: 'REF-001',
            date: '2024-03-10',
            fullName: 'John Doe',
            branchLocation: 'Downtown Branch',
            department: 'Sales',
            dateNeeded: '2024-03-15',
            category: 'cat1',
            description: 'Printer paper (5 packs)\nBallpoint pens (2 boxes)\nSticky notes (10 packs)',
            requestType: 'New Purchase',
            status: 'pending',
            paymentStatus: 'pending',
            amount: 5000,
            submittedAt: '2024-03-10T10:30:00Z',
        },
        {
            id: '2',
            referenceNumber: 'REF-002',
            date: '2024-03-09',
            fullName: 'Jane Smith',
            branchLocation: 'Uptown Branch',
            department: 'HR',
            dateNeeded: '2024-03-14',
            category: 'cat1',
            description: 'Folders (20 pcs)\nHighlighters (1 box)\nNotebooks (5 pcs)',
            requestType: 'Reimbursement',
            status: 'approved',
            paymentStatus: 'pending',
            amount: 3500,
            submittedAt: '2024-03-09T14:20:00Z',
        },
        {
            id: '3',
            referenceNumber: 'REF-003',
            date: '2024-03-08',
            fullName: 'Mike Johnson',
            branchLocation: 'Airport Branch',
            department: 'IT',
            dateNeeded: '2024-03-13',
            category: 'cat5',
            description: 'Stapler (2 pcs)\nStaples (5 boxes)\nPaper clips (10 boxes)',
            requestType: 'New Purchase',
            status: 'rejected',
            paymentStatus: 'pending',
            amount: 1500,
            submittedAt: '2024-03-08T09:15:00Z',
        },
    ],
};

const pettyCashSlice = createSlice({
    name: 'pettyCash',
    initialState,
    reducers: {
        addRequest: (state, action) => {
            state.requests.push(action.payload);
        },
        updateRequestStatus: (state, action) => {
            const { id, status } = action.payload;
            const request = state.requests.find(r => r.id === id);
            if (request) {
                request.status = status;
            }
        },
    },
});

export const { addRequest, updateRequestStatus } = pettyCashSlice.actions;
export default pettyCashSlice.reducer;