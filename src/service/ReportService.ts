import { PaymentMethod, Recipient, Order } from "../store/features/orders/orderTypes";
import { ExportOptions } from "./ExportService";
import { Product } from "../store/features/products/productTypes";

type ReportConfig<T> = {
  fileName: string;
  columns: ExportOptions<T>["columns"];
};

type ReportKeys = "products" | "orders" | "customers";

type ReportData = {
  products: ReportConfig<Product>;
  orders: ReportConfig<Order>;
  customers: ReportConfig<Record<string, unknown>>;
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

// Defensive: default all fields to 0 if missing
const safeStockInfo = (stockInfo: Partial<StockInfo> | undefined | null): StockInfo => ({
  total_instock: stockInfo?.total_instock ?? 0,
  total_reclaim: stockInfo?.total_reclaim ?? 0,
  total_correction: stockInfo?.total_correction ?? 0,
  total_damaged: stockInfo?.total_damaged ?? 0,
  total_migrated: stockInfo?.total_migrated ?? 0,
  total_processed: stockInfo?.total_processed ?? 0,
  total_sold: stockInfo?.total_sold ?? 0,
});

// Copy logic from ProductsTable.tsx
const getTotalInStock = (stockInfo: Partial<StockInfo> | undefined | null): number => {
  const s = safeStockInfo(stockInfo);
  const totalIn = s.total_instock + s.total_reclaim;
  const totalOut = s.total_damaged + s.total_migrated + s.total_processed + s.total_sold;
  return totalIn - totalOut;
};

const getTotalConsumed = (stockInfo: Partial<StockInfo> | undefined | null): number => {
  const safe = safeStockInfo(stockInfo);
  return (
    safe.total_damaged +
    safe.total_migrated +
    safe.total_processed +
    safe.total_sold
  );
};

// Helper function to format quantity with unit conversion
const formatQuantity = (quantity: number, unitType: string) => {
  // Convert grams to kilograms if quantity is >= 1000 and unit type is kilograms
  if ((unitType === "kilograms" || unitType === "kilogram") && quantity >= 1000) {
    const kgQuantity = quantity / 1000;
    return `${kgQuantity.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg`;
  }
  return `${quantity.toLocaleString()} ${unitType}`;
};

export const Reports: ReportData = {
  products: {
    fileName: "products-list",
    columns: [
      { field: "name", header: "Product Name" },
      { field: "sku", header: "SKU" },
      { field: "unit_type", header: "Unit Type" },
      {
        field: "regular_price",
        header: "Price (Ksh)",
        format: (value) => `${value ? value.toLocaleString() : "0"}`,
      },
      {
        field: "stock_info",
        header: "Status",
        format: (value) => {
          const inStock = getTotalInStock(value as Partial<StockInfo>) > 0;
          return inStock ? "In stock" : "Out of stock";
        },
      },
      {
        field: "stock_info",
        header: "In Stock",
        format: (value, rowData?: Product) => {
          const totalIn = getTotalInStock(value as Partial<StockInfo>);
          const unitType = rowData?.unit_type || "";
          return formatQuantity(totalIn, unitType);
        },
      },
      {
        field: "stock_info",
        header: "Consumed",
        format: (value, rowData?: Product) => {
          const totalOut = getTotalConsumed(value as Partial<StockInfo>);
          const unitType = rowData?.unit_type || "";
          return formatQuantity(totalOut, unitType);
        },
      },
    ],
  },
  orders: {
    fileName: "orders-list",
    columns: [
      {
        field: "order_id",
        header: "Order ID",
        format: (value) => `MG${value}`,
      },
      {
        field: "recipient",
        header: "Customer",
        format: (value) => (value as Recipient).full_name,
      },
      {
        field: "total_cost",
        header: "Total",
        format: (value) => (value as number).toLocaleString(),
      },
      { field: "status", header: "Status" },
      {
        field: "payment_method",
        header: "Payment Method",
        format: (value) => (value as PaymentMethod).name,
      },
      { field: "address", header: "Address" },
      {
        field: "created_at",
        header: "Created At",
        format: (value) =>
          new Date(value as string).toLocaleDateString("en-KE", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
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
};

class ReportService {
  static getConfig<K extends keyof ReportData>(reportKey: K): ReportData[K] {
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
