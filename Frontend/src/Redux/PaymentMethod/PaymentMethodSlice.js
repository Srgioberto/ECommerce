import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const paymentMethodsFetch = createAsyncThunk(
  "paymentMethods/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/profile/payment-methods");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const createPaymentMethod = createAsyncThunk(
  "paymentMethods/create",
  async (paymentMethod, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("http://localhost:3000/api/profile/payment-methods", paymentMethod);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const updatePaymentMethod = createAsyncThunk(
  "paymentMethods/update",
  async ({ id, ...paymentMethod }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`http://localhost:3000/api/profile/payment-methods/${id}`, paymentMethod);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const deletePaymentMethod = createAsyncThunk(
  "paymentMethods/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`http://localhost:3000/api/profile/payment-methods/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const PaymentMethodSlice = createSlice({
  name: "paymentMethods",
  initialState: {
    isLoading: false,
    paymentMethods: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(paymentMethodsFetch.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(paymentMethodsFetch.fulfilled, (state, action) => {
      state.isLoading = false;
      state.paymentMethods = action.payload;
      state.error = null;
    });
    builder.addCase(paymentMethodsFetch.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });
    builder.addCase(createPaymentMethod.fulfilled, (state, action) => {
      if (action.payload.isDefault) {
        state.paymentMethods.forEach((p) => (p.isDefault = false));
      }
      state.paymentMethods.push(action.payload);
      state.error = null;
    });
    builder.addCase(createPaymentMethod.rejected, (state, action) => {
      state.error = action.payload || action.error.message;
    });
    builder.addCase(updatePaymentMethod.fulfilled, (state, action) => {
      if (action.payload.isDefault) {
        state.paymentMethods.forEach((p) => (p.isDefault = false));
      }
      const index = state.paymentMethods.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.paymentMethods[index] = action.payload;
      state.error = null;
    });
    builder.addCase(updatePaymentMethod.rejected, (state, action) => {
      state.error = action.payload || action.error.message;
    });
    builder.addCase(deletePaymentMethod.fulfilled, (state, action) => {
      state.paymentMethods = state.paymentMethods.filter((p) => p.id !== action.payload.id);
      state.error = null;
    });
    builder.addCase(deletePaymentMethod.rejected, (state, action) => {
      state.error = action.payload || action.error.message;
    });
  },
});

export default PaymentMethodSlice.reducer;
