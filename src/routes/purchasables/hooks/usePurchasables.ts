import { create } from "zustand";
import { getPurchasables, getPurchasableOrders } from "../domain/purchasable-get";
import type { Purchasable, PurchasableOrder } from "../domain/models";

interface PurchasablesState {
    purchasables: Purchasable[];
    purchasableOrders: PurchasableOrder[];
    loading: boolean;
    error: string | null;
    fetchPurchasables: () => Promise<void>;
    fetchPurchasableOrders: (startDate?: string, endDate?: string) => Promise<void>;
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
    fetchPurchasableOrders: async (startDate?: string, endDate?: string) => {
        set({ loading: true, error: null });
        try {
            // Default to 30 days if no dates provided
            const today = new Date();
            const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

            const defaultEndDate = endDate || today.toLocaleDateString('en-GB').split('/').reverse().join('-');
            const defaultStartDate = startDate || thirtyDaysAgo.toLocaleDateString('en-GB').split('/').reverse().join('-');

            const data = await getPurchasableOrders(defaultStartDate, defaultEndDate);
            set({ purchasableOrders: data, loading: false });
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : "Failed to fetch purchasable orders", loading: false });
        }
    },
})); 