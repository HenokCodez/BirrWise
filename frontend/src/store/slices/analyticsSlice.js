import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getSummary = createAsyncThunk(
  'analytics/getSummary',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/analytics/summary');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getBudgetStatus = createAsyncThunk(
  'analytics/getBudgetStatus',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/analytics/budget-status');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  summary: {
    balance: 0,
    totalIncome: 0,
    totalExpense: 0,
  },
  budgetStatus: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.summary = action.payload;
      })
      .addCase(getSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBudgetStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBudgetStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgetStatus = action.payload;
      })
      .addCase(getBudgetStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = analyticsSlice.actions;
export default analyticsSlice.reducer;
