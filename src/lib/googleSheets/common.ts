
// Browser-compatible Google Sheets access using fetch API
// This implementation uses a public API key for read-only access to Google Sheets

// Using an API key specifically created for accessing this spreadsheet
export const API_KEY = "AIzaSyBOzAHXrq9S7-WiNOJYJF1bATgr5PUMNHY"; // Updated API key
export const spreadsheetId = '1ots1ltPxJGFRpNuvvu--8eAuE-gNtkZJSjcg-7e7E2I';

// Helper function to make authenticated requests to Google Sheets API
export async function fetchSheetData(range: string) {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${API_KEY}`;
    
    console.log(`Fetching data from: ${url.substring(0, url.indexOf('?'))}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', errorText);
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    // Return empty dataset instead of throwing to prevent cascading failures
    return { values: [[], []] };
  }
}

// Helper function to append data to a sheet
export async function appendToSheet(range: string, values: any[][]) {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: values
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', errorText);
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
}

// Helper function to update data in a sheet
export async function updateSheetData(range: string, values: any[][]) {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: values
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', errorText);
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating sheet data:', error);
    throw error;
  }
}
