import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "./productTypes";
import { createProduct, fetchProducts, updateProduct } from "./productThunks";

interface ProductState {
  products: Product[];
  currentOperation: "fetch" | "create" | "update" | "delete" | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  successMessage: string | null;
}

const initialState: ProductState = {
  products: [],
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

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
