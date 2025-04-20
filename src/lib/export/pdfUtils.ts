
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Convert data to PDF format using jsPDF library,
 * including logo and app name at the top.
 */
export const convertToPDF = (data: Record<string, any>[]) => {
  const APP_NAME = "AttendanceX";
  const LOGO_URL = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=128&q=80";
  let imageDataUrl: string | undefined = undefined;

  // Synchronous logo loading (as in old impl)
  const xhr = new XMLHttpRequest();
  xhr.open("GET", LOGO_URL, false);
  xhr.responseType = "blob";
  try {
    xhr.send();
    if (xhr.status === 200) {
      const reader = new FileReader();
      reader.onloadend = function() {
        imageDataUrl = reader.result as string;
      };
      reader.readAsDataURL(xhr.response);
      // Wait for FileReader (max 2s)
      const start = Date.now();
      while (!imageDataUrl && Date.now() - start < 2000) {}
    }
  } catch (e) {
    // Logo optional
  }

  const doc = new jsPDF();
  if (!data || data.length === 0) {
    if (imageDataUrl) doc.addImage(imageDataUrl, "JPEG", 14, 10, 16, 16);
    doc.setFontSize(16);
    doc.text(APP_NAME, 32, 20);
    doc.text("No data available", 20, 40);
    return new Uint8Array(doc.output('arraybuffer'));
  }

  if (imageDataUrl) doc.addImage(imageDataUrl, "JPEG", 14, 10, 16, 16);
  doc.setFontSize(18);
  doc.text(APP_NAME, 34, 22);
  doc.setFontSize(15);
  doc.text("Generated Report", 14, 34);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  doc.setFontSize(11);
  doc.text(`Date: ${formattedDate}`, 14, 41);

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
