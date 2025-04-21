
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Convert data to PDF format using jsPDF library
 */
const convertToPDF = (data: Record<string, any>[]): Uint8Array => {
  if (!data || data.length === 0) {
    const emptyPdf = new jsPDF();
    emptyPdf.text("No data available", 20, 20);
    return new Uint8Array(emptyPdf.output('arraybuffer'));
  }
  const doc = new jsPDF();
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(header => String(row[header] || '')));
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text("YDM TimeSheet", 14, 13);
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  doc.setFontSize(12);
  doc.text(\`Date: \${formattedDate}\`, 14, 27);
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 35,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [63, 81, 181] },
  });
  return new Uint8Array(doc.output('arraybuffer'));
};

export default convertToPDF;
