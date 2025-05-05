import { RootState } from "../../store";

export const selectStocks = (state: RootState) => state.stocks.stocks;

export const selectStockById = (id: string) => (state: RootState) =>
  state.stocks.stocks.find((stock) => stock.id === id);

export const selectIsFetchingStocks = (state: RootState) =>
  state.stocks.status === "loading" &&
  state.stocks.currentOperation === "fetch";

export const selectIsUpdatingStock = (state: RootState) =>
  state.stocks.status === "loading" &&
  state.stocks.currentOperation === "update";

export const selectStocksCurrentOperation = (state: RootState) =>
  state.stocks.currentOperation;

export const selectStocksStatus = (state: RootState) => state.stocks.status;

export const selectStocksError = (state: RootState) => state.stocks.error;
