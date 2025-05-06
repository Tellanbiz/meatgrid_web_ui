import { RootState } from "../../store";

export const selectProductsReport = (state: RootState) =>
  state.reports.productReports;

export const selectStoreReport = (state: RootState) =>
  state.reports.storeReports;

export const selectYearlyReport = (state: RootState) =>
  state.reports.yearlyReports;

export const selectIsFetchingProductReports = (state: RootState) =>
  state.reports.currentOperation === "productReports" &&
  state.reports.status === "loading";

export const selectIsFetchingStoreReports = (state: RootState) =>
  state.reports.currentOperation === "storeReports" &&
  state.reports.status === "loading";

export const selectIsFetchingYearlyReports = (state: RootState) =>
  state.reports.currentOperation === "yearlyReports" &&
  state.reports.status === "loading";

export const selectReportError = (state: RootState) => state.reports.error;

export const selectReportSuccessMessage = (state: RootState) =>
  state.reports.successMessage;
