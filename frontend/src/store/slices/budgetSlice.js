import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getBudgets = createAsyncThunk(
  'budgets/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/budgets');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addBudget = createAsyncThunk(
  'budgets/add',
  async (budgetData, thunkAPI) => {
    try {
      const response = await api.post('/budgets', budgetData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  budgets: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBudgets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBudgets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.budgets = action.payload;
      })
      .addCase(getBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.budgets.unshift(action.payload);
      });
  },
});

export const { reset } = budgetSlice.actions;
export default budgetSlice.reducer;
