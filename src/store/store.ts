import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import couponsReducer from "./features/coupons/couponSlice";
import recipeReducer from "./features/recipe/recipeSlice";
import imageUploadReducer from "./features/uploads/uploadSlice";
import productReducer from "./features/products/productSlice";
import orderReducer from "./features/orders/orderSlice";
import tagReducer from "./features/tags/tagSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    coupons: couponsReducer,
    recipes: recipeReducer,
    uploads: imageUploadReducer,
    products: productReducer,
    orders: orderReducer,
    tags: tagReducer
  },
  devTools: process.env.NODE_ENV != "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
