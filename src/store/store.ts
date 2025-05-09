import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import couponsReducer from "./features/coupons/couponSlice";
import recipeReducer from "./features/recipe/recipeSlice";
import imageUploadReducer from "./features/uploads/uploadSlice";
import productReducer from "./features/products/productSlice";
import orderReducer from "./features/orders/orderSlice";
import tagReducer from "./features/tags/tagSlice";
import categoryReducer from "./features/categories/categorySlice";
import supplierReducer from "./features/suppliers/supplierSlice";
import stockReducer from "./features/stock/stockSlice";
import paymentMethodReducer from "./features/payment-methods/paymentMethodSlice";
import storeReducer from "./features/stores/storeSlice";
import bannerReducer from "./features/banners/bannerSlice";
import storageReducer from "./features/storages/storageSlice";
import reportReducer from "./features/reports/reportSlice";
import processProductReducer from "./features/process-products/processProductSlice";
import accountSlice from "./features/accounts/accountSlice";
import staffReducer from "./features/staff/staffSlice";
import riderReducer from "./features/riders/riderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    coupons: couponsReducer,
    recipes: recipeReducer,
    uploads: imageUploadReducer,
    products: productReducer,
    orders: orderReducer,
    tags: tagReducer,
    categories: categoryReducer,
    suppliers: supplierReducer,
    stocks: stockReducer,
    paymentMethods: paymentMethodReducer,
    stores: storeReducer,
    banners: bannerReducer,
    storages: storageReducer,
    reports: reportReducer,
    processProducts: processProductReducer,
    accounts: accountSlice,
    staff: staffReducer,
    riders: riderReducer,
  },
  devTools: process.env.NODE_ENV != "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
