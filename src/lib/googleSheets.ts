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
import { fetchSheetData, appendToSheet, updateSheetData, API_KEY, spreadsheetId } from './googleSheets/common';

export async function readUsers() {
  try {
    console.log("Reading users from Google Sheets...");
    const data = await fetchSheetData('users!A1:Z1000');
    
    if (!data || !data.values) {
      console.error('Error fetching users: No data returned');
      return [];
    }
    
    const rows = data.values;
    if (!rows || rows.length <= 1) {
      console.log('No user data found in sheet');
      return [];
    }

    const headers = rows[0];
    console.log("User headers found:", headers);
    console.log("Found", rows.length - 1, "user records");
    
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
    console.log("Fetching users to check credentials...");
    const users = await readUsers();
    console.log("Retrieved", users.length, "users for authentication check");
    
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      console.log("User found:", user.email, "with role:", user.role);
    } else {
      console.log("No matching user found for the provided credentials");
    }
    
    return user;
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
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/users:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
  
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
    const response = await fetchSheetData('users!A1:Z1000');
    const rows = response.values;
    
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
    
    return await updateSheetData(targetRange, [updatedRow]);
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

/**
 * Debug utility: Fetches all users from the Google Sheet and logs them.
 * Call debugLogAllUsers() in the browser devtools or at app startup to verify Google Sheets connectivity.
 */
export async function debugLogAllUsers() {
  try {
    console.log("⏬ [Debug] Fetching all users from Google Sheets...");
    const users = await readUsers();
    if (users.length === 0) {
      console.warn("[Debug] No users found, or sheet is empty.");
    } else {
      console.log(`[Debug] Successfully fetched ${users.length} users:`, users);
    }
    return users;
  } catch (error) {
    console.error("[Debug] Error fetching users:", error);
    return [];
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
