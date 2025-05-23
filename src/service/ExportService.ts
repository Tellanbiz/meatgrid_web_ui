import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

export interface ExportOptions<T = Record<string, unknown>> {
  fileName: string;
  sheetName?: string;
  columns: {
    field: keyof T;
    header: string;
    format?: (value: unknown) => unknown;
  }[];
}

class ExportService {
  private static readonly LOGO_URL = "/images/logo.png";
  private static readonly LOGO_WIDTH = 12; // mm - smaller size for header
  private static readonly MARGIN_LEFT = 15; // mm
  private static readonly MARGIN_TOP = 20; // mm

  private static async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  private static convertImageToBase64(img: HTMLImageElement): string {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  }

  private static transformData<T>(
    data: T[],
    columns: ExportOptions["columns"]
  ) {
    return data.map((item) => {
      const row: { [key: string]: unknown } = {};
      columns.forEach((col) => {
        const value = (item as Record<string, unknown>)[col.field];
        row[col.header] = col.format ? col.format(value) : value;
      });
      return row;
    });
  }

  static exportToExcel<T>(data: T[], options: ExportOptions) {
    const { fileName, sheetName = "Sheet1", columns } = options;

    // Transform data according to column specifications
    const exportData = this.transformData(data, columns);

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: fileName,
      Subject: "MeatGrid Export",
      Author: "MeatGrid",
      CreatedDate: new Date(),
    };
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate and download file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  static async exportToPDF<T>(data: T[], options: ExportOptions) {
    const { fileName, columns } = options;
    const doc = new jsPDF();
    const margin = {
      top: this.MARGIN_TOP,
      left: this.MARGIN_LEFT,
      right: this.MARGIN_LEFT,
    };

    let img: HTMLImageElement;
    let logoBase64: string | undefined;

    try {
      img = await this.loadImage(this.LOGO_URL);
      logoBase64 = this.convertImageToBase64(img);
    } catch (error) {
      console.error("Failed to load logo:", error);
    }

    // Get headers and format data for PDF
    const headers = columns.map((col) => col.header);
    const rows: RowInput[] = data.map((item) =>
      columns.map((col) => {
        const value = (item as Record<string, unknown>)[col.field];
        const formattedValue = col.format ? col.format(value) : value;
        return formattedValue != null ? String(formattedValue) : null;
      })
    );

    // Add table to PDF
    autoTable(doc, {
      head: [headers],
      body: rows,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [241, 0, 39],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        textColor: 50,
        fontSize: 9,
        cellPadding: 4,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin,
      didDrawPage: () => {
        if (logoBase64 && img) {
          const pageWidth = doc.internal.pageSize.width;
          const logoWidth = this.LOGO_WIDTH;
          const logoHeight = (img.height * logoWidth) / img.width;

          doc.addImage(
            logoBase64,
            "PNG",
            margin.left,
            margin.top / 2 - logoHeight / 2, // Center vertically in the top margin
            logoWidth,
            logoHeight
          );

          doc.setFontSize(9);
          doc.setTextColor(100);
          const date = new Date().toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          doc.text(date, pageWidth - margin.right, margin.top / 2, {
            align: "right",
            baseline: "middle",
          });
        }
      },
    });

    doc.save(`${fileName}.pdf`);
  }
}

export default ExportService;
