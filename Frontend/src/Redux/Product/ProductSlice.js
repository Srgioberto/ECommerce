import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const productsFetch = createAsyncThunk("products/productsFetch", async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/api/products");
    return data;
  } catch (error) {
    console.error(error.name + " on GET products: " + error.message + " " + error.code);
  }
});

// Builds the multipart body shared by create/update: text fields, an
// optional list of { size, stock } entries, which existing gallery photos to
// keep (edit only), and any newly added photo files.
const buildProductFormData = (formData) => {
  const body = new FormData();
  body.append("name", formData.name);
  body.append("price", formData.price);
  body.append("CategoryId", formData.CategoryId);
  if (formData.sizes && formData.sizes.length > 0) {
    body.append("sizes", JSON.stringify(formData.sizes));
  } else {
    body.append("stock", formData.stock);
  }
  body.append("existingImages", JSON.stringify(formData.existingImages || []));
  (formData.imageFiles || []).forEach((file) => body.append("images", file));
  return body;
};

export const createProduct = createAsyncThunk(
  "order/admin/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/products",
        buildProductFormData(formData)
      );
      return data;
    } catch (error) {
      console.error(error.name + " on create product: " + error.message + " " + error.code);
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "order/admin/updateProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        "http://localhost:3000/api/admin/products/" + formData.id,
        buildProductFormData(formData)
      );
      return data;
    } catch (error) {
      console.error(error.name + " on update product: " + error.message + " " + error.code);
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "order/admin/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete("http://localhost:3000/api/admin/products/" + id);
      return data;
    } catch (error) {
      console.error(error.name + " on delete product: " + error.message + " " + error.code);
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const ProductSlice = createSlice({
  name: "products",
  initialState: {
    isLoading: false,
    products: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    //get products
    builder.addCase(productsFetch.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(productsFetch.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
      state.error = null;
    });
    builder.addCase(productsFetch.rejected, (state, action) => {
      state.isLoading = false;
      state.products = [];
      state.error = action.error.message;
    });
    //create product
    builder.addCase(createProduct.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products.push(action.payload);
      state.error = null;
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });
    //Update product
    builder.addCase(updateProduct.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.products.findIndex((product) => product.id === action.payload.id);
      state.products[index] = action.payload;
      state.error = null;
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });
    //Delete product
    builder.addCase(deleteProduct.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.products.findIndex((product) => product.id === action.payload.product.id);
      if (action.payload.deleted) {
        state.products.splice(index, 1);
      } else {
        state.products[index] = action.payload.product;
      }
      state.error = null;
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });
  },
});

export default ProductSlice.reducer;
