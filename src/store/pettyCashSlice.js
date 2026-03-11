// src/store/pettyCashSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    requests: [
        {
            id: '1',
            date: '2024-03-10',
            fullName: 'John Doe',
            branchLocation: 'Downtown Branch',
            dateNeeded: '2024-03-15',
            stationaries: 'Printer paper (5 packs)\nBallpoint pens (2 boxes)\nSticky notes (10 packs)',
            requestType: 'New Purchase',
            status: 'pending',
            submittedAt: '2024-03-10T10:30:00Z',
        },
        {
            id: '2',
            date: '2024-03-09',
            fullName: 'Jane Smith',
            branchLocation: 'Uptown Branch',
            dateNeeded: '2024-03-14',
            stationaries: 'Folders (20 pcs)\nHighlighters (1 box)\nNotebooks (5 pcs)',
            requestType: 'Reimbursement of Existing purchase',
            status: 'approved',
            submittedAt: '2024-03-09T14:20:00Z',
        },
        {
            id: '3',
            date: '2024-03-08',
            fullName: 'Mike Johnson',
            branchLocation: 'Airport Branch',
            dateNeeded: '2024-03-13',
            stationaries: 'Stapler (2 pcs)\nStaples (5 boxes)\nPaper clips (10 boxes)',
            requestType: 'New Purchase',
            status: 'rejected',
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