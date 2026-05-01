import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import transactionReducer from './slices/transactionSlice';
import analyticsReducer from './slices/analyticsSlice';
import budgetReducer from './slices/budgetSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    analytics: analyticsReducer,
    budgets: budgetReducer,
    theme: themeReducer,
  },
});
