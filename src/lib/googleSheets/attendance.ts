import { fetchSheetData, appendToSheet, updateSheetData, spreadsheetId } from './common';
import { AttendanceRecord } from '@/lib/types';

export async function readAttendanceByDate(date: string) {
  try {
    const response = await fetchSheetData('attendance!A1:Z1000');
    
    // If we get an empty response or error, return empty array
    if (!response || !response.values) return [];
    
    const rows = response.values;
    if (!rows || rows.length === 0) return [];

    const headers = rows[0];
    const records = rows.slice(1).map((row) =>
      Object.fromEntries(headers.map((key, i) => [key, row[i] || '']))
    );

    return records.filter((r) => r.date === date);
  } catch (error) {
    console.error('Error reading attendance:', error);
    return []; // Return empty array instead of throwing
  }
}

export async function addAttendanceRecordToSheet(record: AttendanceRecord) {
  try {
    const newRow = [
      record.id,
      record.employeeId,
      record.employeeName,
      record.date,
      record.present,
      record.startTime || '',
      record.endTime || '',
      record.overtimeHours || 0,
      record.note || '',
    ];

    await appendToSheet('attendance', [newRow]);
  } catch (error) {
    console.error('Error adding attendance record:', error);
    throw error;
  }
}

export async function updateAttendanceRecordInSheet(updatedData: {
  id: string;
  [key: string]: any;
}) {
  try {
    // First, get all data to find the row index
    const response = await fetchSheetData('attendance!A1:Z1000');
    
    const rows = response.values;
    if (!rows || rows.length === 0) return;

    const headers = rows[0];
    const body = rows.slice(1);
    const index = body.findIndex((r) => r[0] === updatedData.id);
    if (index === -1) return;

    const updatedRow = [...body[index]];
    headers.forEach((key, i) => {
      if (updatedData[key] !== undefined) {
        updatedRow[i] = updatedData[key];
      }
    });

    // Update just the single row
    await updateSheetData(`attendance!A${index + 2}:${String.fromCharCode(65 + headers.length - 1)}${index + 2}`, [updatedRow]);
  } catch (error) {
    console.error('Error updating attendance record:', error);
    throw error;
  }
}

export async function deleteAttendanceRecordFromSheet(id: string) {
  try {
    // For delete, we'll actually just update the row with empty values
    const response = await fetchSheetData('attendance!A1:Z1000');
    
    const rows = response.values;
    if (!rows || rows.length === 0) return;

    const headers = rows[0];
    const body = rows.slice(1);
    const index = body.findIndex((r) => r[0] === id);
    if (index === -1) return;

    const emptyRow = new Array(headers.length).fill('');
    
    // Update the row with empty values
    await updateSheetData(`attendance!A${index + 2}:${String.fromCharCode(65 + headers.length - 1)}${index + 2}`, [emptyRow]);
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    throw error;
  }
}
