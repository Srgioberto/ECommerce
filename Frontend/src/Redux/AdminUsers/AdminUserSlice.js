import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const adminUsersFetch = createAsyncThunk(
  "adminUsers/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/admin/users");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const setUserAdmin = createAsyncThunk(
  "adminUsers/setUserAdmin",
  async ({ id, admin }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`http://localhost:3000/api/admin/users/${id}/admin`, { admin });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const AdminUserSlice = createSlice({
  name: "adminUsers",
  initialState: {
    isLoading: false,
    users: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(adminUsersFetch.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(adminUsersFetch.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
      state.error = null;
    });
    builder.addCase(adminUsersFetch.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });
    builder.addCase(setUserAdmin.fulfilled, (state, action) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) state.users[index] = action.payload;
      state.error = null;
    });
    builder.addCase(setUserAdmin.rejected, (state, action) => {
      state.error = action.payload || action.error.message;
    });
  },
});

export default AdminUserSlice.reducer;
