// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import pettyCashReducer from './pettyCashSlice';
import userReducer from './userSlice';
import branchReducer from './branchSlice';
import categoryReducer from './categorySlice';
import departmentReducer from './departmentSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    pettyCash: pettyCashReducer,
    user: userReducer,
    branch: branchReducer,
    category: categoryReducer,
    department: departmentReducer,
    notifications: notificationReducer,
  },
});