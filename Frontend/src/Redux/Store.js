import { configureStore } from "@reduxjs/toolkit";
import ProductSlice from "./Product/ProductSlice";
import CategorySlice from "./Category/CategorySlice";
import CartSlice from "./Cart/CartSlice";
import OrderSlice from "./Order/OrderSlice";
import sessionStorage from "redux-persist/es/storage/session";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import UserSlice from "./User/UserSlice";

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
