import { configureStore } from "@reduxjs/toolkit";
import ProductSlice from "./Product/ProductSlice";
import CategorySlice from "./Category/CategorySlice";
import CartSlice from "./Cart/CartSlice";
import OrderSlice from "./Order/OrderSlice";
import sessionStorage from "redux-persist/es/storage/session";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import UserSlice from "./User/UserSlice";
import AdminUserSlice from "./AdminUsers/AdminUserSlice";
import AddressSlice from "./Address/AddressSlice";
import PaymentMethodSlice from "./PaymentMethod/PaymentMethodSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage: sessionStorage,
  debug: true,
};

const rootReducer = combineReducers({
  products: ProductSlice,
  categories: CategorySlice,
  cart: CartSlice,
  orders: OrderSlice,
  user: UserSlice,
  adminUsers: AdminUserSlice,
  addresses: AddressSlice,
  paymentMethods: PaymentMethodSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export default store;
