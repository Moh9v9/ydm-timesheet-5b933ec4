
import { google } from 'googleapis';
import credentials from '@/lib/credentials.json';
import { AttendanceRecord } from '@/lib/types';

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = '1ots1ltPxJGFRpNuvvu--8eAuE-gNtkZJSjcg-7e7E2I';

// -------------------- موظفين --------------------

const employeeRange = 'employees!A1:Z1000';
const employeeAppendRange = 'employees';

export async function readEmployees() {
  const client = await auth.getClient();
  const sheets = google.sheets({ 
    version: 'v4', 
    auth: client as any // Use type assertion to bypass the type checking
  });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: employeeRange,
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) return [];

  const headers = rows[0];
  return rows.slice(1).map((row) =>
    Object.fromEntries(headers.map((key, i) => [key, row[i] || '']))
  );
}

export async function addEmployee(employeeData: {
  id: string;
  fullName: string;
  iqamaNo: string;
  project: string;
  location: string;
  jobTitle: string;
  paymentType: string;
  rateOfPayment: string;
  sponsorship: string;
  status: string;
}) {
  const client = await auth.getClient();
  const sheets = google.sheets({ 
    version: 'v4', 
    auth: client as any 
  });

  const now = new Date().toISOString();

  const newRow = [
    employeeData.id,
    employeeData.fullName,
    employeeData.iqamaNo,
    employeeData.project,
    employeeData.location,
    employeeData.jobTitle,
    employeeData.paymentType,
    employeeData.rateOfPayment,
    employeeData.sponsorship,
    employeeData.status,
    now,
    '',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: employeeAppendRange,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [newRow],
    },
  });
}

export async function updateEmployee(updatedData: {
  id: string;
  [key: string]: string | undefined;
}) {
  const client = await auth.getClient();
  const sheets = google.sheets({ 
    version: 'v4', 
    auth: client as any 
  });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: employeeRange,
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) return;

  const headers = rows[0];
  const bodyRows = rows.slice(1);
  const index = bodyRows.findIndex((row) => row[0] === updatedData.id);
  if (index === -1) return;

  const originalRow = bodyRows[index];
  const updatedRow = [...originalRow];

  headers.forEach((key, i) => {
    if (updatedData[key] !== undefined) {
      updatedRow[i] = updatedData[key]!;
    }
  });

  const updatedAtIndex = headers.indexOf('updated_at');
  if (updatedAtIndex !== -1) {
    updatedRow[updatedAtIndex] = new Date().toISOString();
  }

  const targetRange = `employees!A${index + 2}:Z${index + 2}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: targetRange,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [updatedRow],
    },
  });
}

export async function deleteEmployee(id: string) {
  const client = await auth.getClient();
  const sheets = google.sheets({ 
    version: 'v4', 
    auth: client as any 
  });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: employeeRange,
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) return;

  const headers = rows[0];
  const bodyRows = rows.slice(1);
  const index = bodyRows.findIndex((row) => row[0] === id);
  if (index === -1) return;

  const emptyRow = new Array(headers.length).fill('');
  const targetRange = `employees!A${index + 2}:Z${index + 2}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: targetRange,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [emptyRow],
    },
  });
}

// -------------------- حضور --------------------

export async function readAttendanceByDate(date: string) {
  const client = await auth.getClient();
  const sheets = google.sheets({ 
    version: 'v4', 
    auth: client as any 
  });

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
  const sheets = google.sheets({ 
    version: 'v4', 
    auth: client as any 
  });

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
  const sheets = google.sheets({ 
    version: 'v4', 
    auth: client as any 
  });

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
  const sheets = google.sheets({ 
    version: 'v4', 
    auth: client as any 
  });

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
