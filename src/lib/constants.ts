// API endpoints
export const API_ENDPOINTS = {
  FACULTY_STATUS: '/api/faculty-status',
} as const;

// UI constants
export const UI_CONSTANTS = {
  COLORS: {
    GREEN: 'border-green-500 bg-green-50',
    YELLOW: 'border-yellow-500 bg-yellow-50', 
    RED: 'border-red-500 bg-red-50',
  },
  ICONS: {
    COMPLETED: '✅',
    NOT_COMPLETED: '❌',
  },
  MESSAGES: {
    LOADING: 'Loading faculty status...',
    NO_RESULTS: 'No faculty found matching your search.',
    NO_DATA: 'No faculty data available.',
    SEARCH_PLACEHOLDER: 'Search faculty...',
  },
} as const;

// Service account configuration
export const SERVICE_ACCOUNT_EMAIL = 'service@facultydesk.iam.gserviceaccount.com';

// Error messages
export const ERROR_MESSAGES = {
  PERMISSION_TITLE: 'Google Sheets Access Required',
  GENERIC_TITLE: 'Error Loading Data',
  QUICK_FIX: 'Quick Fix: Share your Google Sheets with the service account:',
  RETRY_BUTTON: 'Try Again',
  SETUP_BUTTON: 'Setup Guide',
} as const;
