import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportData {
    [key: string]: string | number;
}

export const exportToExcel = (data: ExportData[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (data: ExportData[], fileName: string) => {
    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [255, 90, 95]; // #ff5a5f

    // Add title
    doc.setFontSize(18);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = 'Stocks Report';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 18);

    // Add date
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 26);

    // Add table
    autoTable(doc, {
        head: [Object.keys(data[0])],
        body: data.map(item => Object.values(item)),
        startY: 34,
        styles: {
            fontSize: 9,
            cellPadding: 3,
            lineColor: [220, 53, 69], // subtle red border
            lineWidth: 0.2,
        },
        headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontSize: 11,
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [255, 245, 245], // very light red
        },
        tableLineColor: [220, 53, 69],
        tableLineWidth: 0.2,
        margin: { left: 10, right: 10 },
    });

    doc.save(`${fileName}.pdf`);
}; 