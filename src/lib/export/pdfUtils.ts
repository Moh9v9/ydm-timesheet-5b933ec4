
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Convert data to PDF format using jsPDF library,
 * including logo and app name at the top.
 */
export const convertToPDF = (data: Record<string, any>[]) => {
  const APP_NAME = "AttendanceX";
  const LOGO_URL = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=128&q=80";
  
  const doc = new jsPDF();
  
  // Handle case with no data
  if (!data || data.length === 0) {
    doc.setFontSize(16);
    doc.text(APP_NAME, 20, 20);
    doc.text("No data available", 20, 40);
    return new Uint8Array(doc.output('arraybuffer'));
  }

  // Add header with app name
  doc.setFontSize(18);
  doc.text(APP_NAME, 14, 22);
  doc.setFontSize(15);
  doc.text("Generated Report", 14, 34);

  // Add current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  doc.setFontSize(11);
  doc.text(`Date: ${formattedDate}`, 14, 41);

  // Create table with data
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(header => String(row[header] || '')));
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 47,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [63, 81, 181] },
  });
  
  return new Uint8Array(doc.output('arraybuffer'));
};
