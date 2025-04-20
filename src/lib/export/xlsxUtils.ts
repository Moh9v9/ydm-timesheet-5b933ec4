
import * as XLSX from 'xlsx';

/**
 * Convert data to XLSX format using xlsx library.
 */
export const convertToXLSX = (data: Record<string, any>[]): Uint8Array => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Uint8Array(excelBuffer);
};
