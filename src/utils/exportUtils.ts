import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExportData {
    [key: string]: string | number;
}

interface AutoTableOptions {
    head: string[][];
    body: (string | number)[][];
    startY: number;
    styles: {
        fontSize: number;
        cellPadding: number;
    };
    headStyles: {
        fillColor: number[];
        textColor: number;
        fontSize: number;
        fontStyle: string;
    };
}

interface JsPDFWithAutoTable extends jsPDF {
    autoTable: (options: AutoTableOptions) => void;
}

export const exportToExcel = (data: ExportData[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (data: ExportData[], fileName: string) => {
    const doc = new jsPDF() as JsPDFWithAutoTable;

    // Add title
    doc.setFontSize(16);
    doc.text('Stocks Report', 14, 15);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Add table
    doc.autoTable({
        head: [Object.keys(data[0])],
        body: data.map(item => Object.values(item)),
        startY: 30,
        styles: {
            fontSize: 8,
            cellPadding: 2,
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontSize: 10,
            fontStyle: 'bold',
        },
    });

    doc.save(`${fileName}.pdf`);
}; 