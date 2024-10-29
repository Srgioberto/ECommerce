import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const categoriesFetch = createAsyncThunk("categories/categoriesFetch", async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/api/categories");
    return data;
  } catch (error) {
    console.error(error.name + " on GET categories: " + error.message + " " + error.code);
  }
});

const CategorySlice = createSlice({
  name: "categories",
  initialState: {
    isLoading: false,
    categories: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(categoriesFetch.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(categoriesFetch.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
      state.error = null;
    });
    builder.addCase(categoriesFetch.rejected, (state, action) => {
      state.isLoading = false;
      state.categories = [];
      state.error = action.error.message;
    });
  },
});

export default CategorySlice.reducer;
