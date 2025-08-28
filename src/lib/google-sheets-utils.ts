import { SERVICE_ACCOUNT_EMAIL } from './constants';

/**
 * Utility to get the service account email from environment credentials
 */
export const getServiceAccountEmail = (): string | null => {
  try {
    const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
    if (!credentials) {
      return null;
    }
    
    const parsed = JSON.parse(credentials);
    return parsed.client_email || null;
  } catch {
    return null;
  }
};

/**
 * Get sharing instructions for Google Sheets
 */
export const getSharingInstructions = (): string => {
  const email = getServiceAccountEmail() || SERVICE_ACCOUNT_EMAIL;
  
  return `To enable access to your Google Sheets:
1. Open each Google Sheet in your browser
2. Click the "Share" button (top right)
3. Add this email address: ${email}
4. Set permission to "Viewer" or "Editor"
5. Click "Send"

Service Account Email: ${email}`;
};
