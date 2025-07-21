import { create } from "zustand";
import { getPurchasables, getPurchasableOrders } from "../domain/purchasable-get";
import type { Purchasable, PurchasableOrder } from "../domain/models";
import axios from "@/service/api";

interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  building_name: string;
  points: [number, number];
  is_store: boolean;
  is_warehouse: boolean;
  is_active: boolean;
  created_at: string;
}

interface StorageType {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface PurchasablesState {
    purchasables: Purchasable[];
    purchasableOrders: PurchasableOrder[];
    stores: Store[];
    storageTypes: StorageType[];
    selectedStore: string | null;
    loading: boolean;
    ordersLoading: boolean;
    storesLoading: boolean;
    storageTypesLoading: boolean;
    error: string | null;
    fetchPurchasables: (storeId?: string) => Promise<void>;
    fetchPurchasableOrders: (startDate?: string, endDate?: string) => Promise<void>;
    fetchStores: () => Promise<void>;
    fetchStorageTypes: () => Promise<void>;
    setSelectedStore: (storeId: string | null) => void;
    refreshData: () => Promise<void>;
    refreshOrders: () => Promise<void>;
}

export const usePurchasables = create<PurchasablesState>((set, get) => ({
    purchasables: [],
    purchasableOrders: [],
    stores: [],
    storageTypes: [],
    selectedStore: null,
    loading: false,
    ordersLoading: false,
    storesLoading: false,
    storageTypesLoading: false,
    error: null,
    fetchPurchasables: async (storeId?: string) => {
        set({ loading: true, error: null });
        try {
            const currentStoreId = storeId || get().selectedStore;
            const data = await getPurchasables(currentStoreId || undefined);
            set({ purchasables: data, loading: false });
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : "Failed to fetch purchasables", loading: false });
        }
    },
    fetchPurchasableOrders: async (startDate?: string, endDate?: string) => {
        set({ ordersLoading: true, error: null });
        try {
            // Default to 30 days if no dates provided
            const today = new Date();
            const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

            const defaultEndDate = endDate || today.toLocaleDateString('en-GB').split('/').reverse().join('-');
            const defaultStartDate = startDate || thirtyDaysAgo.toLocaleDateString('en-GB').split('/').reverse().join('-');

            const data = await getPurchasableOrders(defaultStartDate, defaultEndDate);
            set({ purchasableOrders: data, ordersLoading: false });
        } catch (e: unknown) {
            set({ error: e instanceof Error ? e.message : "Failed to fetch purchasable orders", ordersLoading: false });
        }
    },
    fetchStores: async () => {
        set({ storesLoading: true });
        try {
            const response = await axios.get<Store[]>("/stores");
            set({ stores: response.data, storesLoading: false });
        } catch (e: unknown) {
            console.error('Failed to fetch stores:', e);
            set({ stores: [], storesLoading: false });
        }
    },
    fetchStorageTypes: async () => {
        set({ storageTypesLoading: true });
        try {
            const response = await axios.get<StorageType[]>("/storagetypes");
            set({ storageTypes: response.data, storageTypesLoading: false });
        } catch (e: unknown) {
            console.error('Failed to fetch storage types:', e);
            set({ storageTypes: [], storageTypesLoading: false });
        }
    },
    setSelectedStore: (storeId: string | null) => {
        const actualStoreId = storeId === "all" ? null : storeId;
        set({ selectedStore: actualStoreId });
        // Automatically refresh purchasables when store changes
        get().fetchPurchasables(actualStoreId || undefined);
    },
    refreshData: async () => {
        const { selectedStore } = get();
        await get().fetchPurchasables(selectedStore || undefined);
    },
    refreshOrders: async () => {
        await get().fetchPurchasableOrders();
    },
})); 