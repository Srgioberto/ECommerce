import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const logUser = createAsyncThunk("user/logUser", async (info, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:3000/api/auth/login", {
      email: info.email,
      password: info.password,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error.name + " on logIn user: " + error.message + " " + error.code);
    return rejectWithValue("Error in log in user");
  }
});

export const registerUser = createAsyncThunk("user/registerUser", async (newUser, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:3000/api/auth/register", newUser);
    return response.data;
  } catch (error) {
    console.error(error.name + " on register user: " + error.message + " " + error.code);
    return rejectWithValue("Error in register user");
  }
});

const UserSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    isLoggedIn: false,
    user: null,
    error: null,
  },
  reducers: {
    logOut: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    //LogIn User
    builder.addCase(logUser.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(logUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.error = action.error.message;
    });
    //register new user
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const { logOut } = UserSlice.actions;

export default UserSlice.reducer;
