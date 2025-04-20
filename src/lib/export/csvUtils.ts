
/**
 * Convert data to CSV format.
 */
export const convertToCSV = (data: Record<string, any>[]): string => {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const csvRows = [];
  csvRows.push(headers.join(','));
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
};
