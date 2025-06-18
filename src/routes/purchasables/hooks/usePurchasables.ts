import { create } from "zustand";
import { getPurchasables, getPurchasableOrders } from "../domain/purchasable-get";
import type { Purchasable, PurchasableOrder } from "../domain/models";

interface PurchasablesState {
    purchasables: Purchasable[];
    purchasableOrders: PurchasableOrder[];
    loading: boolean;
    error: string | null;
    fetchPurchasables: () => Promise<void>;
    fetchPurchasableOrders: () => Promise<void>;
}

export const usePurchasables = create<PurchasablesState>((set) => ({
    purchasables: [],
    purchasableOrders: [],
    loading: false,
    error: null,
    fetchPurchasables: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getPurchasables();
            set({ purchasables: data, loading: false });
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : "Failed to fetch purchasables", loading: false });
        }
    },
    fetchPurchasableOrders: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getPurchasableOrders();
            set({ purchasableOrders: data, loading: false });
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : "Failed to fetch purchasable orders", loading: false });
        }
    },
})); 