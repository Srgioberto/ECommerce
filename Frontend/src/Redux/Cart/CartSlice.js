import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const cartFetch = createAsyncThunk("cart/cartFetch", async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/api/cart");
    return data;
  } catch (error) {
    console.error(error.name + " on GET cart: " + error.message + " " + error.code);
  }
});

export const addItem = createAsyncThunk("cart/addItem", async (info) => {
  try {
    let quantity = info.cartItem.qty;
    if (info.mode === "plus") {
      quantity += 1;
    } else if (info.mode === "minus") {
      quantity -= 1;
    }
    const { data } = await axios.post("http://localhost:3000/api/cart/", {
      qty: quantity,
      ProductId: info.cartItem.ProductId,
    });
    return data;
  } catch (error) {
    console.error(error.name + " on addItem cart: " + error.message + " " + error.code);
  }
});

export const emptyCart = createAsyncThunk("cart/emptyCart", async (data) => {
  try {
    const { data } = await axios.put("http://localhost:3000/api/cart/clear");
    return data;
  } catch (error) {
    console.error(error.name + " on empty cart: " + error.message + " " + error.code);
  }
});

export const removeItem = createAsyncThunk("cart/removeItem", async (cartItem) => {
  try {
    const { data } = await axios.delete("http://localhost:3000/api/cart", {
      data: {
        ProductId: cartItem.ProductId,
      },
    });
    return data;
  } catch (error) {
    console.error(error.name + " on removeItem cart: " + error.message + " " + error.code);
  }
});

const CartSlice = createSlice({
  name: "cart",
  initialState: {
    isLoading: false,
    CartItems: [],
    total: 0,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      //we check is the CartItems already has items or not
      if (!state.CartItems) {
        //if its empty, we just add the new item
        state.CartItems.push(action.payload);
        state.total += action.payload.price * action.payload.qty;
      } else {
        //if it has items then we check is the item is already on it or not
        const existingItem = state.CartItems.find((item) => item.ProductId === action.payload.ProductId);
        if (existingItem) {
          // if is already on the cart then we update the values
          let updatedCart = state.CartItems.map((item) => {
            if (item.ProductId === action.payload.ProductId) {
              item.qty = action.payload.qty;
              let updatedItem = item;
              return updatedItem;
            } else {
              return item;
            }
          });

          state.carts = updatedCart;
        } else {
          //if not found we just add the new item
          state.CartItems.push(action.payload);
          state.total += action.payload.price * action.payload.qty;
        }
      }
    },
    addQty: (state, action) => {
      const existingItem = state.CartItems.find((item) => item.ProductId === action.payload.ProductId);
      //if item quantity greater than 1 then increase the quantity by 1
      if (existingItem.qty >= 1) {
        state.CartItems = state.CartItems.map((item) => {
          if (item.ProductId === action.payload.ProductId) {
            item.qty += 1;
          }
          return item;
        });
      }
    },
    minusQty: (state, action) => {
      const existingItem = state.CartItems.find((item) => item.ProductId === action.payload.ProductId);
      //if item quantity greater than 2 then we minus the qty by 1
      if (existingItem.qty >= 2) {
        state.CartItems = state.CartItems.map((item) => {
          if (item.ProductId === action.payload.ProductId) {
            item.qty -= 1;
          }
          return item;
        });
      }
    },
    removeFromCart(state, action) {
      state.CartItems.map((cartItem) => {
        if (cartItem.ProductId === action.payload.ProductId) {
          const nextCartItems = state.CartItems.filter((item) => item.ProductId !== cartItem.ProductId);

          state.CartItems = nextCartItems;
        }
        return state;
      });
    },
    getTotals(state, action) {
      let { total } = state.CartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, qty } = cartItem;
          const itemTotal = price * qty;

          cartTotal.total += itemTotal;

          return cartTotal;
        },
        {
          total: 0,
          qty: 0,
        }
      );
      total = parseFloat(total.toFixed(2));
      state.total = total;
    },
    clearCart(state, action) {
      state.CartItems = [];
    },
  },
  extraReducers: (builder) => {
    //Cart
    builder.addCase(cartFetch.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(cartFetch.fulfilled, (state, action) => {
      state.isLoading = false;
      state.CartItems = action.payload.CartItems;
      state.total = action.payload.total;
      state.error = null;
    });
    builder.addCase(cartFetch.rejected, (state, action) => {
      state.isLoading = false;
      state.CartItems = [];
      state.error = action.error.message;
    });

    //Add to Cart
    builder.addCase(addItem.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addItem.fulfilled, (state, action) => {
      state.isLoading = false;
      state.CartItems = action.payload.CartItems;
      state.total = action.payload.total;
      state.error = null;
    });
    builder.addCase(addItem.rejected, (state, action) => {
      state.isLoading = false;
      state.CartItems = [];
      state.error = action.error.message;
    });

    //Empty Cart
    builder.addCase(emptyCart.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(emptyCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.CartItems = action.payload.CartItems;
      state.total = action.payload.total;
      state.error = null;
    });
    builder.addCase(emptyCart.rejected, (state, action) => {
      state.isLoading = false;
      state.CartItems = [];
      state.error = action.error.message;
    });

    //Remove Item from Cart
    builder.addCase(removeItem.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(removeItem.fulfilled, (state, action) => {
      state.isLoading = false;
      state.CartItems = action.payload.CartItems;
      state.total = action.payload.total;
      state.error = null;
    });
    builder.addCase(removeItem.rejected, (state, action) => {
      state.isLoading = false;
      state.CartItems = [];
      state.error = action.error.message;
    });
  },
});

export const { addToCart, getTotals, removeFromCart, clearCart, addQty, minusQty } = CartSlice.actions;

export default CartSlice.reducer;
