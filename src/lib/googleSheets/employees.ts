
import { google } from 'googleapis';
import { auth, spreadsheetId } from './common';

const employeeRange = 'employees!A1:Z1000';
const employeeAppendRange = 'employees';

export async function readEmployees() {
  try {
    const sheets = google.sheets('v4');
    
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: employeeRange,
      auth: auth,
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) return [];

    const headers = rows[0];
    return rows.slice(1).map((row) =>
      Object.fromEntries(headers.map((key, i) => [key, row[i] || '']))
    );
  } catch (error) {
    console.error('Error reading employees:', error);
    throw error;
  }
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
  try {
    const sheets = google.sheets('v4');

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
      auth: auth,
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
}

export async function updateEmployee(updatedData: {
  id: string;
  [key: string]: string | undefined;
}) {
  try {
    const sheets = google.sheets('v4');

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: employeeRange,
      auth: auth,
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
      auth: auth,
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
}

export async function deleteEmployee(id: string) {
  try {
    const sheets = google.sheets('v4');

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: employeeRange,
      auth: auth,
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
      auth: auth,
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}
