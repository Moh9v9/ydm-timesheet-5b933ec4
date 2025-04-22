import { fetchSheetData, appendToSheet, updateSheetData } from './common';

const employeeRange = 'employees!A1:Z1000';
const employeeAppendRange = 'employees';

export async function readEmployees() {
  try {
    const response = await fetchSheetData(employeeRange);
    
    // If we get an empty response or error, return empty array
    if (!response || !response.values) return [];
    
    const rows = response.values;
    if (!rows || rows.length === 0) return [];

    const headers = rows[0];
    return rows.slice(1).map((row) =>
      Object.fromEntries(headers.map((key, i) => [key, row[i] || '']))
    );
  } catch (error) {
    console.error('Error reading employees:', error);
    return []; // Return empty array instead of throwing
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

    await appendToSheet(employeeAppendRange, [newRow]);
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
    const response = await fetchSheetData(employeeRange);
    
    const rows = response.values;
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

    // Update the specific row
    await updateSheetData(`employees!A${index + 2}:${String.fromCharCode(65 + headers.length - 1)}${index + 2}`, [updatedRow]);
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
}

export async function deleteEmployee(id: string) {
  try {
    const response = await fetchSheetData(employeeRange);
    
    const rows = response.values;
    if (!rows || rows.length === 0) return;

    const headers = rows[0];
    const bodyRows = rows.slice(1);
    const index = bodyRows.findIndex((row) => row[0] === id);
    if (index === -1) return;

    const emptyRow = new Array(headers.length).fill('');
    
    // Update the row with empty values (soft delete)
    await updateSheetData(`employees!A${index + 2}:${String.fromCharCode(65 + headers.length - 1)}${index + 2}`, [emptyRow]);
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}
