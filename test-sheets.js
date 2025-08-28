// Test script to verify Google Sheets API connection
import { getFacultyStatus } from '../src/lib/google-sheets.js';

async function testGoogleSheetsConnection() {
  try {
    console.log('Testing Google Sheets API connection...');
    
    // Load environment variables
    const dotenv = await import('dotenv');
    dotenv.config({ path: '.env.local' });
    
    const facultyData = await getFacultyStatus();
    
    console.log('✅ Google Sheets API connection successful!');
    console.log('Faculty data retrieved:');
    console.log(JSON.stringify(facultyData, null, 2));
    
  } catch (error) {
    console.error('❌ Google Sheets API connection failed:');
    console.error(error.message);
    
    if (error.message.includes('credentials')) {
      console.log('\n💡 Tip: Make sure GOOGLE_SHEETS_CREDENTIALS is set in .env.local');
    } else if (error.message.includes('permission')) {
      console.log('\n💡 Tip: Make sure the service account has access to the Google Sheets');
      console.log('   Share the sheets with: service@facultydesk.iam.gserviceaccount.com');
    }
  }
}

testGoogleSheetsConnection();
