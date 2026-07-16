import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addressesFetch = createAsyncThunk(
  "addresses/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/profile/addresses");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const createAddress = createAsyncThunk(
  "addresses/create",
  async (address, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("http://localhost:3000/api/profile/addresses", address);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "addresses/update",
  async ({ id, ...address }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`http://localhost:3000/api/profile/addresses/${id}`, address);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "addresses/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`http://localhost:3000/api/profile/addresses/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const AddressSlice = createSlice({
  name: "addresses",
  initialState: {
    isLoading: false,
    addresses: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addressesFetch.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addressesFetch.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addresses = action.payload;
      state.error = null;
    });
    builder.addCase(addressesFetch.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });
    builder.addCase(createAddress.fulfilled, (state, action) => {
      if (action.payload.isDefault) {
        state.addresses.forEach((a) => (a.isDefault = false));
      }
      state.addresses.push(action.payload);
      state.error = null;
    });
    builder.addCase(createAddress.rejected, (state, action) => {
      state.error = action.payload || action.error.message;
    });
    builder.addCase(updateAddress.fulfilled, (state, action) => {
      if (action.payload.isDefault) {
        state.addresses.forEach((a) => (a.isDefault = false));
      }
      const index = state.addresses.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) state.addresses[index] = action.payload;
      state.error = null;
    });
    builder.addCase(updateAddress.rejected, (state, action) => {
      state.error = action.payload || action.error.message;
    });
    builder.addCase(deleteAddress.fulfilled, (state, action) => {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload.id);
      state.error = null;
    });
    builder.addCase(deleteAddress.rejected, (state, action) => {
      state.error = action.payload || action.error.message;
    });
  },
});

export default AddressSlice.reducer;
