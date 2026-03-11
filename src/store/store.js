// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import pettyCashReducer from './pettyCashSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    pettyCash: pettyCashReducer,
    user: userReducer,
  },
});