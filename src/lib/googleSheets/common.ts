
// Shared Google Sheets authentication and spreadsheetId

import { google } from 'googleapis';
import credentials from '@/lib/credentials.json';

export const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const spreadsheetId = '1ots1ltPxJGFRpNuvvu--8eAuE-gNtkZJSjcg-7e7E2I';
