import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useDashboardStore } from "../store/dashboard-store";
import {
  fetchProductsReport,
  fetchStoresReport,
  fetchYearlyReport,
  fetchTopStores,
  fetchProductDailyReport,
  fetchDashboardStatistics,
  fetchLatestOrders,
} from "../domain/dashboard-api";
import type {
  FetchReportRequest,
  FetchStoreReportRequest,
  FetchYearlyReportRequest,
  FetchTopStoresRequest,
  FetchProductDailyReportRequest,
  FetchDashboardStatisticsRequest,
  FetchLatestOrdersRequest,
  FetchTopProductsRequest,
} from "../domain/models";

// Helper function to get default date range (30 days)
const getDefaultDateRange = (): { start_date: string; end_date: string } => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  return {
    start_date: startDate.toISOString().split('T')[0], // yyyy-mm-dd format
    end_date: endDate.toISOString().split('T')[0], // yyyy-mm-dd format
  };
};

export function useDashboard() {
  const {
    productReports,
    storeReports,
    yearlyReports,
    topProducts,
    topStores,
    dashboardStatistics,
    productDailyReport,
    latestOrders,
    loading,
    errors,
    setProductReports,
    setStoreReports,
    setYearlyReports,
    setTopProducts,
    setTopStores,
    setDashboardStatistics,
    setProductDailyReport,
    setLatestOrders,
    setLoading,
    setError,
    clearErrors,
  } = useDashboardStore();

  // Fetch product reports
  const fetchProductReportsData = useCallback(async (params?: FetchReportRequest) => {
    try {
      setLoading("productReports", true);
      setError("productReports", null);
      const data = await fetchProductsReport(params);
      setProductReports(data);
      // Set the first product as default for daily report
      if (data.length > 0) {
        const defaultDates = getDefaultDateRange();
        await fetchProductDailyReportData({
          ...defaultDates,
          product_id: data[0].product_id,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch product reports";
      setError("productReports", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading("productReports", false);
    }
  }, [setLoading, setError, setProductReports]);

  // Fetch store reports
  const fetchStoreReportsData = useCallback(async (params?: FetchStoreReportRequest) => {
    try {
      setLoading("storeReports", true);
      setError("storeReports", null);
      const data = await fetchStoresReport(params);
      setStoreReports(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch store reports";
      setError("storeReports", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading("storeReports", false);
    }
  }, [setLoading, setError, setStoreReports]);

  // Fetch yearly reports
  const fetchYearlyReportsData = useCallback(async (params?: FetchYearlyReportRequest) => {
    try {
      setLoading("yearlyReports", true);
      setError("yearlyReports", null);
      const year = params?.year ?? new Date().getFullYear();
      const data = await fetchYearlyReport({ ...params, year });
      setYearlyReports(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch yearly reports";
      setError("yearlyReports", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading("yearlyReports", false);
    }
  }, [setLoading, setError, setYearlyReports]);

  // Fetch top products (using product reports)
  const fetchTopProductsData = useCallback(async (params?: FetchTopProductsRequest) => {
    try {
      setLoading("topProducts", true);
      setError("topProducts", null);
      const data = await fetchProductsReport(params);
      setTopProducts(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch top products";
      setError("topProducts", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading("topProducts", false);
    }
  }, [setLoading, setError, setTopProducts]);

  // Fetch top stores
  const fetchTopStoresData = useCallback(async (params?: FetchTopStoresRequest) => {
    try {
      setLoading("topStores", true);
      setError("topStores", null);
      const data = await fetchTopStores(params);
      setTopStores(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch top stores";
      setError("topStores", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading("topStores", false);
    }
  }, [setLoading, setError, setTopStores]);

  // Fetch product daily report
  const fetchProductDailyReportData = useCallback(async (params: FetchProductDailyReportRequest) => {
    try {
      setLoading("productDailyReport", true);
      setError("productDailyReport", null);
      const data = await fetchProductDailyReport(params);
      setProductDailyReport(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch product daily report";
      setError("productDailyReport", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading("productDailyReport", false);
    }
  }, [setLoading, setError, setProductDailyReport]);

  // Fetch dashboard statistics
  const fetchDashboardStatisticsData = useCallback(async (params?: FetchDashboardStatisticsRequest) => {
    try {
      setLoading("dashboardStatistics", true);
      setError("dashboardStatistics", null);
      const defaultDates = getDefaultDateRange();
      const requestParams = params || defaultDates;
      const data = await fetchDashboardStatistics(requestParams);
      setDashboardStatistics(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch dashboard statistics";
      setError("dashboardStatistics", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading("dashboardStatistics", false);
    }
  }, [setLoading, setError, setDashboardStatistics]);

  // Fetch latest orders
  const fetchLatestOrdersData = useCallback(async (params?: Partial<FetchLatestOrdersRequest>) => {
    try {
      setLoading("latestOrders", true);
      setError("latestOrders", null);
      const defaultDates = getDefaultDateRange();
      const requestParams: FetchLatestOrdersRequest = {
        start_date: params?.start_date || defaultDates.start_date,
        end_date: params?.end_date || defaultDates.end_date,
        limit: params?.limit || 10,
      };
      const data = await fetchLatestOrders(requestParams);
      setLatestOrders(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch latest orders";
      setError("latestOrders", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading("latestOrders", false);
    }
  }, [setLoading, setError, setLatestOrders]);

  // Fetch all dashboard data
  const fetchAllDashboardData = useCallback(async () => {
    const defaultDates = getDefaultDateRange();
    const currentYear = new Date().getFullYear();
    
    // Fetch all data in parallel
    await Promise.all([
      fetchDashboardStatisticsData(defaultDates),
      fetchTopProductsData({ ...defaultDates, limit: 10 }),
      fetchTopStoresData({ ...defaultDates, limit: 10 }),
      fetchLatestOrdersData({ ...defaultDates, limit: 10 }),
      fetchYearlyReportsData({ year: currentYear }), // Use current year for combined stats
    ]);
  }, [
    fetchDashboardStatisticsData,
    fetchTopProductsData,
    fetchTopStoresData,
    fetchLatestOrdersData,
    fetchYearlyReportsData,
  ]);

  // Create combined stats from yearly reports (current year)
  const combinedStats = useMemo(() => {
    if (!yearlyReports || yearlyReports.length === 0) return [];
    
    return yearlyReports.map((report) => ({
      month: report.month_name,
      revenue: report.monthly_revenue,
      order_count: report.order_count,
    }));
  }, [yearlyReports]);

  // Fetch combined stats data
  const fetchCombinedStatsData = useCallback(async () => {
    const currentYear = new Date().getFullYear();
    await fetchYearlyReportsData({ year: currentYear });
  }, [fetchYearlyReportsData]);

  return {
    // Data
    productReports,
    storeReports,
    yearlyReports,
    topProducts,
    topStores,
    dashboardStatistics,
    productDailyReport,
    latestOrders,
    combinedStats,
    
    // Loading states
    loading,
    
    // Errors
    errors,
    
    // Actions
    fetchProductReportsData,
    fetchStoreReportsData,
    fetchYearlyReportsData,
    fetchTopProductsData,
    fetchTopStoresData,
    fetchProductDailyReportData,
    fetchDashboardStatisticsData,
    fetchLatestOrdersData,
    fetchAllDashboardData,
    fetchCombinedStatsData,
    
    // Utility functions
    clearErrors,
  };
} 