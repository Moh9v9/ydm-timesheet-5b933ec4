
// This file now uses the browser-compatible implementation from the googleSheets folder

import {
  readEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
} from '@/lib/googleSheets/employees';

import {
  readAttendanceByDate,
  addAttendanceRecordToSheet,
  updateAttendanceRecordInSheet,
  deleteAttendanceRecordFromSheet
} from '@/lib/googleSheets/attendance';

// -------------------- Users --------------------
import { User } from "@/lib/types";

export async function readUsers() {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1ots1ltPxJGFRpNuvvu--8eAuE-gNtkZJSjcg-7e7E2I/values/users!A1:Z1000?key=AIzaSyC7t-AYO6LnR38MMCI38uGt42R8I_BF4Ew`
    );
    
    if (!response.ok) {
      console.error('Error fetching users:', response.statusText);
      return [];
    }
    
    const data = await response.json();
    
    const rows = data.values;
    if (!rows || rows.length === 0) return [];

    const headers = rows[0];
    return rows.slice(1).map((row) =>
      Object.fromEntries(headers.map((key, i) => [key, row[i] || '']))
    );
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

export async function getUserByEmailAndPassword(email: string, password: string) {
  try {
    const users = await readUsers();
    return users.find((u: any) => u.email === email && u.password === password);
  } catch (error) {
    console.error('Error in getUserByEmailAndPassword:', error);
    return null;
  }
}

export async function addUser(user: {
  id: string;
  email: string;
  fullName: string;
  password: string;
  role: string;
}) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/1ots1ltPxJGFRpNuvvu--8eAuE-gNtkZJSjcg-7e7E2I/values/users:append?valueInputOption=USER_ENTERED&key=AIzaSyC7t-AYO6LnR38MMCI38uGt42R8I_BF4Ew`;
  
  const now = new Date().toISOString();

  const newRow = [
    user.id,
    user.email,
    user.fullName,
    user.password,
    user.role,
    now,
    '',
  ];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [newRow],
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', errorText);
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

export async function updateUserRole(id: string, newRole: string) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1ots1ltPxJGFRpNuvvu--8eAuE-gNtkZJSjcg-7e7E2I/values/users!A1:Z1000?key=AIzaSyC7t-AYO6LnR38MMCI38uGt42R8I_BF4Ew`
    );

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values;
    
    if (!rows || rows.length === 0) return;

    const headers = rows[0];
    const bodyRows = rows.slice(1);
    const index = bodyRows.findIndex((row) => row[0] === id);
    if (index === -1) return;

    const originalRow = bodyRows[index];
    const updatedRow = [...originalRow];

    headers.forEach((key, i) => {
      if (key === 'role') updatedRow[i] = newRole;
      if (key === 'updated_at') updatedRow[i] = new Date().toISOString();
    });

    const targetRange = `users!A${index + 2}:${String.fromCharCode(65 + headers.length - 1)}${index + 2}`;
    
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/1ots1ltPxJGFRpNuvvu--8eAuE-gNtkZJSjcg-7e7E2I/values/${encodeURIComponent(targetRange)}?valueInputOption=USER_ENTERED&key=AIzaSyC7t-AYO6LnR38MMCI38uGt42R8I_BF4Ew`;
    
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [updatedRow]
      })
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('API Response Error:', errorText);
      throw new Error(`Google Sheets API error: ${updateResponse.status} ${updateResponse.statusText}`);
    }

    return await updateResponse.json();
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

// Re-export the functions from the sub-modules
export {
  readEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  readAttendanceByDate,
  addAttendanceRecordToSheet,
  updateAttendanceRecordInSheet,
  deleteAttendanceRecordFromSheet
};
