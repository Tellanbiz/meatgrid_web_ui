import { CSSProperties } from "react";
import { TextPrimary } from "./Colors";

export const DataTableStyle: CSSProperties = {
  minWidth: "5rem",
  fontSize: "0.875rem",
  backgroundColor: "#ffffff",
};

export const TableHeaderStyle: CSSProperties = {
  fontWeight: "normal",
  fontSize: ".85rem",
  color: TextPrimary,
  backgroundColor: "#ffffff"
};

export const ColumnWidthStyle: {
  small: CSSProperties;
  medium: CSSProperties;
  large: CSSProperties;
} = {
  small: { width: "3rem" },
  medium: { width: "10rem" },
  large: { width: "20rem" },
};
