// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import pettyCashReducer from './pettyCashSlice';

export const store = configureStore({
  reducer: {
    pettyCash: pettyCashReducer,
  },
});