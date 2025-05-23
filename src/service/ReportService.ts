import { ExportOptions } from "./ExportService";

type ReportConfig = {
  fileName: string;
  columns: ExportOptions["columns"];
};

type ReportKeys = "products" | "orders" | "customers";

type ReportData = {
  [K in ReportKeys]: ReportConfig;
};
type StockInfo = {
  total_instock: number;
  total_reclaim: number;
  total_correction: number;
  total_damaged: number;
  total_migrated: number;
  total_processed: number;
  total_sold: number;
};

const getTotalInStock = (stockInfo: StockInfo): number => {
  const totalIn = stockInfo.total_instock + stockInfo.total_reclaim;

  const totalOut =
    stockInfo.total_correction +
    stockInfo.total_damaged +
    stockInfo.total_migrated +
    stockInfo.total_processed +
    stockInfo.total_sold;
  return totalIn - totalOut;
};

const getTotalConsumed = (stockInfo: StockInfo): number => {
  const totalOut =
    stockInfo.total_correction +
    stockInfo.total_damaged +
    stockInfo.total_migrated +
    stockInfo.total_processed +
    stockInfo.total_sold;
  return totalOut;
};

export const Reports: ReportData = {
  products: {
    fileName: "products-list",
    columns: [
      { field: "name", header: "Product Name" },
      {
        field: "regular_price",
        header: "Price (Ksh)",
        format: (value) => `${value ? value.toLocaleString() : "0"}`,
      },
      { field: "unit_type", header: "Unit Type" },
      {
        field: "stock_info",
        header: "Status",
        format: (value) => {
          const inStock = getTotalInStock(value as StockInfo) > 0;
          return inStock ? "In stock" : "Out of stock";
        },
      },
      {
        field: "stock_info",
        header: "In Stock",
        format: (value) => {
          const stockInfo = value as StockInfo;
          const totalIn = getTotalInStock(stockInfo);
          return `${totalIn.toLocaleString()}`;
        },
      },
      {
        field: "stock_info",
        header: "Consumed",
        format: (value) => {
          const stockInfo = value as StockInfo;
          const totalOut = getTotalConsumed(stockInfo);
          return `${totalOut.toLocaleString()}`;
        },
      },
      {
        field: "is_product",
        header: "Is Product",
        format: (value) => (value ? "Yes" : "No"),
      },
      {
        field: "is_raw_material",
        header: "Is Raw Material",
        format: (value) => (value ? "Yes" : "No"),
      },
    ],
  },
  orders: {
    fileName: "orders-list",
    columns: [
      { field: "id", header: "Order ID" },
      { field: "customer_name", header: "Customer" },
      {
        field: "total",
        header: "Total",
        format: (value) => `$${value}`,
      },
      { field: "status", header: "Status" },
      {
        field: "created_at",
        header: "Order Date",
        format: (value) => new Date(value as string).toLocaleDateString(),
      },
    ],
  },
  customers: {
    fileName: "customers-list",
    columns: [
      { field: "name", header: "Name" },
      { field: "email", header: "Email" },
      { field: "phone", header: "Phone" },
      {
        field: "created_at",
        header: "Joined Date",
        format: (value) => new Date(value as string).toLocaleDateString(),
      },
    ],
  },
  // Add more report configurations as needed
};

class ReportService {
  static getConfig<K extends ReportKeys>(reportKey: K): ReportConfig {
    return Reports[reportKey];
  }

  static getAllReportKeys(): ReportKeys[] {
    return Object.keys(Reports) as ReportKeys[];
  }

  static hasReport(key: string): key is ReportKeys {
    return key in Reports;
  }
}

export default ReportService;
