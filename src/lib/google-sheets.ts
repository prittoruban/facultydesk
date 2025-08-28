import { google } from 'googleapis';
import { facultySheets, sheetTabs, type FacultyData, type FacultyStatus } from './faculty-sheets';
import { GoogleSheetsError } from './errors';
import { SERVICE_ACCOUNT_EMAIL } from './constants';
import env from './env';

type SheetsClient = ReturnType<typeof google.sheets>;

// Initialize Google Sheets API
const getGoogleSheetsClient = (): SheetsClient => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(env.GOOGLE_SHEETS_CREDENTIALS),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    throw new GoogleSheetsError('Failed to initialize Google Sheets client', error as Error);
  }
};

// Check if a sheet tab has data (at least 1 row after header)
const checkSheetHasData = async (
  sheets: SheetsClient,
  spreadsheetId: string,
  tabName: string
): Promise<boolean> => {
  try {
    const range = `${tabName}!A2:Z1000`; // Start from row 2 to skip header
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = response.data.values;
    if (!values || values.length === 0) {
      return false;
    }

    // Check if there's at least one row with some data
    const hasData = values.some((row: string[]) => 
      row.some((cell: string) => cell && cell.toString().trim() !== '')
    );

    return hasData;
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    if (err.code === 403) {
      console.error(`❌ Permission denied for sheet ${spreadsheetId}, tab: ${tabName}`);
      console.error(`💡 Please share the Google Sheet with: ${SERVICE_ACCOUNT_EMAIL}`);
      throw new GoogleSheetsError(
        `Permission denied. Please share the Google Sheet (${spreadsheetId}) with the service account: ${SERVICE_ACCOUNT_EMAIL}`
      );
    }
    console.error(`Error checking data for ${tabName} in ${spreadsheetId}:`, error);
    return false;
  }
};

// Special check for "Class Taken" tab - ensure today's date is present
const checkClassTakenForToday = async (
  sheets: SheetsClient,
  spreadsheetId: string
): Promise<boolean> => {
  try {
    const tabName = 'Class Taken';
    const range = `${tabName}!A:Z`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = response.data.values;
    if (!values || values.length <= 1) {
      return false;
    }

    const today = new Date();
    const todayString = today.toLocaleDateString(); // Format: MM/DD/YYYY
    const todayISO = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const todayDDMMYYYY = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`; // Format: DD/MM/YYYY

    // Search for today's date in any cell
    const hasToday = values.some((row: string[]) =>
      row.some((cell: string) => {
        if (!cell) return false;
        const cellStr = cell.toString().toLowerCase();
        return cellStr.includes(todayString.toLowerCase()) ||
               cellStr.includes(todayISO) ||
               cellStr.includes(todayDDMMYYYY);
      })
    );

    return hasToday;
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    if (err.code === 403) {
      console.error(`❌ Permission denied for sheet ${spreadsheetId}, tab: Class Taken`);
      console.error(`💡 Please share the Google Sheet with: ${SERVICE_ACCOUNT_EMAIL}`);
      throw new GoogleSheetsError(
        `Permission denied. Please share the Google Sheet (${spreadsheetId}) with the service account: ${SERVICE_ACCOUNT_EMAIL}`
      );
    }
    console.error(`Error checking Class Taken for today in ${spreadsheetId}:`, error);
    return false;
  }
};

// Get faculty status for all sheets
export const getFacultyStatus = async (): Promise<FacultyData> => {
  try {
    const sheets = getGoogleSheetsClient();
    const facultyData: FacultyData = {};

    for (const [facultyName, spreadsheetId] of Object.entries(facultySheets)) {
      const facultyStatus: FacultyStatus = {} as FacultyStatus;

      for (const tab of sheetTabs) {
        try {
          if (tab === 'Class Taken') {
            // Special check for Class Taken - must have today's date
            facultyStatus[tab] = await checkClassTakenForToday(sheets, spreadsheetId);
          } else {
            // Regular check for other tabs
            facultyStatus[tab] = await checkSheetHasData(sheets, spreadsheetId, tab);
          }
        } catch (error) {
          console.error(`Error checking ${tab} for ${facultyName}:`, error);
          facultyStatus[tab] = false; // Default to false on error
        }
      }

      facultyData[facultyName] = facultyStatus;
    }

    return facultyData;
  } catch (error) {
    console.error('Error fetching faculty status:', error);
    if (error instanceof GoogleSheetsError) {
      throw error;
    }
    throw new GoogleSheetsError('Failed to fetch faculty data from Google Sheets');
  }
};

// Get last updated timestamp for a specific sheet tab
export const getSheetLastUpdated = async (
  spreadsheetId: string,
  tabName: string
): Promise<string | null> => {
  try {
    const sheets = getGoogleSheetsClient();
    
    // Get sheet metadata to find last updated time
    await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'sheets.properties,modifiedTime',
    });

    // Note: Google Sheets API doesn't provide per-tab modification time
    // This is a limitation - we can only get the overall sheet modification time
    // For now, we'll return a placeholder or the sheet's general modified time
    return new Date().toISOString(); // Placeholder - in real implementation, you might need to store this separately
  } catch (error) {
    console.error(`Error getting last updated time for ${tabName}:`, error);
    return null;
  }
};
