
import { google } from 'googleapis';
import { auth, spreadsheetId } from './common';
import { AttendanceRecord } from '@/lib/types';

export async function readAttendanceByDate(date: string) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client as any });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'attendance!A1:Z1000',
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) return [];

  const headers = rows[0];
  const records = rows.slice(1).map((row) =>
    Object.fromEntries(headers.map((key, i) => [key, row[i] || '']))
  );

  return records.filter((r) => r.date === date);
}

export async function addAttendanceRecordToSheet(record: AttendanceRecord) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client as any });

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
  });
}

export async function updateAttendanceRecordInSheet(updatedData: {
  id: string;
  [key: string]: any;
}) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client as any });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'attendance!A1:Z1000',
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
  });
}

export async function deleteAttendanceRecordFromSheet(id: string) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client as any });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'attendance!A1:Z1000',
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
  });
}
