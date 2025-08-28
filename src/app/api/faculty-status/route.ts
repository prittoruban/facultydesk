import { NextResponse } from 'next/server';
import { getFacultyStatus } from '@/lib/google-sheets';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch faculty status from Google Sheets
    const facultyData = await getFacultyStatus();

    return NextResponse.json(facultyData);
  } catch (error) {
    console.error('Error fetching faculty status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch faculty data. Please ensure Google Sheets are properly shared with the service account.' },
      { status: 500 }
    );
  }
}
