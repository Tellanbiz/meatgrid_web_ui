import { create } from "zustand";
import { Order } from "@/store/features/orders/orderTypes";
import {
  ProductReport,
  StoreReport,
  MonthReport,
  DashboardStatistics,
  ProductDailyReport,
} from "../domain/models";

interface DashboardState {
  // Data
  productReports: ProductReport[];
  storeReports: StoreReport[];
  yearlyReports: MonthReport[];
  topProducts: ProductReport[];
  topStores: StoreReport[];
  dashboardStatistics: DashboardStatistics | null;
  productDailyReport: ProductDailyReport | null;
  latestOrders: Order[];

  // Loading states
  loading: {
    productReports: boolean;
    storeReports: boolean;
    yearlyReports: boolean;
    topProducts: boolean;
    topStores: boolean;
    dashboardStatistics: boolean;
    productDailyReport: boolean;
    latestOrders: boolean;
  };

  // Error states
  errors: {
    productReports: string | null;
    storeReports: string | null;
    yearlyReports: string | null;
    topProducts: string | null;
    topStores: string | null;
    dashboardStatistics: string | null;
    productDailyReport: string | null;
    latestOrders: string | null;
  };

  // Actions
  setProductReports: (reports: ProductReport[]) => void;
  setStoreReports: (reports: StoreReport[]) => void;
  setYearlyReports: (reports: MonthReport[]) => void;
  setTopProducts: (products: ProductReport[]) => void;
  setTopStores: (stores: StoreReport[]) => void;
  setDashboardStatistics: (statistics: DashboardStatistics) => void;
  setProductDailyReport: (report: ProductDailyReport) => void;
  setLatestOrders: (orders: Order[]) => void;

  setLoading: (key: keyof DashboardState['loading'], loading: boolean) => void;
  setError: (key: keyof DashboardState['errors'], error: string | null) => void;

  resetState: () => void;
  clearErrors: () => void;
}

const initialState = {
  productReports: [],
  storeReports: [],
  yearlyReports: [],
  topProducts: [],
  topStores: [],
  dashboardStatistics: null,
  productDailyReport: null,
  latestOrders: [],
  loading: {
    productReports: false,
    storeReports: false,
    yearlyReports: false,
    topProducts: false,
    topStores: false,
    dashboardStatistics: false,
    productDailyReport: false,
    latestOrders: false,
  },
  errors: {
    productReports: null,
    storeReports: null,
    yearlyReports: null,
    topProducts: null,
    topStores: null,
    dashboardStatistics: null,
    productDailyReport: null,
    latestOrders: null,
  },
};

export const useDashboardStore = create<DashboardState>((set) => ({
  ...initialState,

  setProductReports: (reports) => set({ productReports: reports }),
  setStoreReports: (reports) => set({ storeReports: reports }),
  setYearlyReports: (reports) => set({ yearlyReports: reports }),
  setTopProducts: (products) => set({ topProducts: products }),
  setTopStores: (stores) => set({ topStores: stores }),
  setDashboardStatistics: (statistics) => set({ dashboardStatistics: statistics }),
  setProductDailyReport: (report) => set({ productDailyReport: report }),
  setLatestOrders: (orders) => set({ latestOrders: orders }),

  setLoading: (key, loading) =>
    set((state) => ({
      loading: { ...state.loading, [key]: loading }
    })),

  setError: (key, error) =>
    set((state) => ({
      errors: { ...state.errors, [key]: error }
    })),

  resetState: () => set(initialState),

  clearErrors: () => set({
    errors: {
      productReports: null,
      storeReports: null,
      yearlyReports: null,
      topProducts: null,
      topStores: null,
      dashboardStatistics: null,
      productDailyReport: null,
      latestOrders: null,
    },
  }),
})); 