import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "./productTypes";
import { CorporateProduct } from "./corporateProductTypes";
import { createProduct, fetchProducts, updateProduct } from "./productThunks";
import { fetchCorporateProducts } from "./corporateProductThunks";

interface ProductState {
  products: Product[];
  corporateProducts: CorporateProduct[];
  currentOperation: "fetch" | "fetch_corporate" | "create" | "update" | "delete" | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  successMessage: string | null;
}

const initialState: ProductState = {
  products: [],
  corporateProducts: [],
  currentOperation: null,
  status: "idle",
  error: null,
  successMessage: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.status = "idle";
      state.error = null;
      state.currentOperation = null;
    },
    clearProductMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch";
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = "succeeded";
          state.products = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch products";
      })
      // Fetch corporate products
      .addCase(fetchCorporateProducts.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch_corporate";
        state.error = null;
      })
      .addCase(
        fetchCorporateProducts.fulfilled,
        (state, action: PayloadAction<CorporateProduct[]>) => {
          state.status = "succeeded";
          state.corporateProducts = action.payload;
        }
      )
      .addCase(fetchCorporateProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch corporate products";
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "create";
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create product";
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "update";
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update product";
      });
  },
});

export const { resetProductState, clearProductMessages } = productSlice.actions;
export default productSlice.reducer;
