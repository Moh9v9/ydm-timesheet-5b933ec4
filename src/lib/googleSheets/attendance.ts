
import { google } from 'googleapis';
import { auth, spreadsheetId } from './common';
import { AttendanceRecord } from '@/lib/types';

export async function readAttendanceByDate(date: string) {
  try {
    const sheets = google.sheets({ version: 'v4' });
    
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'attendance!A1:Z1000',
      auth,
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) return [];

    const headers = rows[0];
    const records = rows.slice(1).map((row) =>
      Object.fromEntries(headers.map((key, i) => [key, row[i] || '']))
    );

    return records.filter((r) => r.date === date);
  } catch (error) {
    console.error('Error reading attendance:', error);
    throw error;
  }
}

export async function addAttendanceRecordToSheet(record: AttendanceRecord) {
  try {
    const sheets = google.sheets({ version: 'v4' });
    
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

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'attendance',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [newRow] },
      auth,
    });
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
    const sheets = google.sheets({ version: 'v4' });
    
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'attendance!A1:Z1000',
      auth,
    });

    const rows = res.data.values;
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

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `attendance!A${index + 2}:Z${index + 2}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [updatedRow],
      },
      auth,
    });
  } catch (error) {
    console.error('Error updating attendance record:', error);
    throw error;
  }
}

export async function deleteAttendanceRecordFromSheet(id: string) {
  try {
    const sheets = google.sheets({ version: 'v4' });
    
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'attendance!A1:Z1000',
      auth,
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) return;

    const headers = rows[0];
    const body = rows.slice(1);
    const index = body.findIndex((r) => r[0] === id);
    if (index === -1) return;

    const emptyRow = new Array(headers.length).fill('');
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `attendance!A${index + 2}:Z${index + 2}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [emptyRow],
      },
      auth,
    });
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    throw error;
  }
}
