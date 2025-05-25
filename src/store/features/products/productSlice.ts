import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "./productTypes";
import { CorporateProduct } from "./corporateProductTypes";
import { StoreProduct } from "./storeProductTypes";
import { createProduct, fetchProducts, updateProduct } from "./productThunks";
import {
  fetchCorporateProducts,
  updateCorporateProduct,
} from "./corporateProductThunks";
import {
  fetchStoreProducts,
  updateStoreProduct,
  deleteStoreProduct,
} from "./storeProductThunks";

interface ProductState {
  products: Product[];
  corporateProducts: CorporateProduct[];
  storeProducts: StoreProduct[];
  currentOperation:
    | "fetch"
    | "fetch_corporate"
    | "fetch_store"
    | "create"
    | "update"
    | "update_corporate"
    | "update_store"
    | "delete"
    | "delete_store_product"
    | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  successMessage: string | null;
}

const initialState: ProductState = {
  products: [],
  corporateProducts: [],
  storeProducts: [],
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
          // Ensure we're handling the payload correctly
          if (Array.isArray(action.payload)) {
            state.corporateProducts = action.payload;
          } else {
            console.error("Expected array but got:", action.payload);
            state.corporateProducts = [];
          }
        }
      )
      .addCase(fetchCorporateProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch corporate products";
      })
      // Fetch store products
      .addCase(fetchStoreProducts.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch_store";
        state.error = null;
      })
      .addCase(
        fetchStoreProducts.fulfilled,
        (state, action: PayloadAction<StoreProduct[]>) => {
          state.status = "succeeded";
          // Ensure we're handling the payload correctly
          if (Array.isArray(action.payload)) {
            state.storeProducts = action.payload;
          } else {
            console.error("Expected array but got:", action.payload);
            state.storeProducts = [];
          }
        }
      )
      .addCase(fetchStoreProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch store products";
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
      })
      // Update corporate product
      .addCase(updateCorporateProduct.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "update_corporate";
        state.error = null;
      })
      .addCase(updateCorporateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Handle the case where action.payload might be an object with a message property
        if (typeof action.payload === "string") {
          state.successMessage = action.payload;
        } else if (
          action.payload &&
          typeof action.payload === "object" &&
          "message" in action.payload
        ) {
          // If it's an object with a message property, use that
          state.successMessage = action.payload.message as string;
        } else {
          state.successMessage = "Corporate product updated successfully";
        }
      })
      .addCase(updateCorporateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to update corporate product";
      })
      // Update store product
      .addCase(updateStoreProduct.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "update_store";
        state.error = null;
      })
      .addCase(updateStoreProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(updateStoreProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update store product";
      })
      // Delete store product
      .addCase(deleteStoreProduct.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "delete_store_product";
        state.error = null;
      })
      .addCase(deleteStoreProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(deleteStoreProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete store product";
      });
  },
});

export const { resetProductState, clearProductMessages } = productSlice.actions;
export default productSlice.reducer;
