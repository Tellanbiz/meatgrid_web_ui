import { create } from "zustand";
import { getBatches } from "../domain/processing-get";
import { ProductBatch } from "../domain/data";

interface BatchesState {
  batches: ProductBatch[];
  loading: boolean;
  error: string | null;
  fetchBatches: () => Promise<void>;
  resetState: () => void;
}

const initialState = {
  batches: [],
  loading: false,
  error: null,
};

export const useBatchesStore = create<BatchesState>((set) => ({
  ...initialState,

  fetchBatches: async () => {
    set({ loading: true, error: null });
    try {
      const batches = await getBatches();
      set({ batches, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch batches";
      set({ error: errorMessage, loading: false });
    }
  },

  resetState: () => set(initialState),
})); 