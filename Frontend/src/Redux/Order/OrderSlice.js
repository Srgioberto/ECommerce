import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const ordersFetch = createAsyncThunk("orders/admin/ordersFetch", async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/api/admin/orders/");
    return data;
  } catch (error) {
    console.error(error.name + " on GET all orders: " + error.message + " " + error.code);
  }
});

export const userOrdersFetch = createAsyncThunk("orders/userOrdersFetch", async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/api/orders");
    return data;
  } catch (error) {
    console.error(error.name + " on GET all user orders: " + error.message + " " + error.code);
  }
});

export const createOrder = createAsyncThunk("order/createOrder", async (formData) => {
  try {
    const { data } = await axios.post("http://localhost:3000/api/orders", {
      address1: formData.address1,
      address2: formData.address2,
      province: formData.province,
      city: formData.city,
      country: formData.country,
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error(error.name + " on create Order: " + error.message + " " + error.code);
  }
});

export const updateOrder = createAsyncThunk("order/admin/updateOrder", async (update) => {
  try {
    const { data } = await axios.put("http://localhost:3000/api/orders", {
      OrderId: update.id,
      status: update.status,
      address1: update.address1,
      address2: update.address2,
      province: update.province,
      city: update.city,
      country: update.country,
    });
    return data;
  } catch (error) {
    console.error(error.name + " on update Order: " + error.message + " " + error.code);
  }
});

const OrderSlice = createSlice({
  name: "orders",
  initialState: {
    isLoading: false,
    Orders: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    //Get ALL Orders
    builder.addCase(ordersFetch.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(ordersFetch.fulfilled, (state, action) => {
      state.isLoading = false;
      state.Orders = action.payload;
      state.error = null;
    });
    builder.addCase(ordersFetch.rejected, (state, action) => {
      state.isLoading = false;
      state.Orders = [];
      state.error = action.error.message;
    });

    //Get Orders from User
    builder.addCase(userOrdersFetch.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(userOrdersFetch.fulfilled, (state, action) => {
      state.isLoading = false;
      state.Orders = action.payload;
      state.error = null;
    });
    builder.addCase(userOrdersFetch.rejected, (state, action) => {
      state.isLoading = false;
      state.Orders = [];
      state.error = action.error.message;
    });

    //Create order
    builder.addCase(createOrder.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.Orders.push(action.payload);
      state.error = null;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    //Update order
    builder.addCase(updateOrder.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.Orders.findIndex((order) => order.id === action.payload.id);
      state.Orders[index] = action.payload;
      state.error = null;
    });
    builder.addCase(updateOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export default OrderSlice.reducer;
