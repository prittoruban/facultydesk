# Faculty Desk - HOD Dashboard

A Next.js dashboard application for HODs to monitor faculty data completion status across Google Sheets.

## Features

- **Authentication**: Secure login for HOD using email/password stored in environment variables
- **Google Sheets Integration**: Reads data from multiple faculty Google Sheets
- **Real-time Status Monitoring**: Shows completion status for each faculty across all required tabs
- **Search & Filter**: Search faculty by name
- **Responsive Design**: Clean, modern UI built with Tailwind CSS
- **Color-coded Status**: Visual indicators for completion levels (Green/Yellow/Red)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: JWT-based session management
- **API Integration**: Google Sheets API
- **TypeScript**: Full type safety

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd facultydesk
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Update the following environment variables:

#### Authentication
```env
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_EMAIL=hod@university.edu
ADMIN_PASSWORD=your-secure-password
```

#### Google Sheets API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create credentials (Service Account):
   - Go to "Credentials" → "Create Credentials" → "Service Account"
   - Download the JSON key file
5. Share your Google Sheets with the service account email
6. Copy the entire JSON content to the environment variable:

```env
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"...","private_key":"..."}
```

### 3. Faculty Sheets Configuration

Update the sheet IDs in `src/lib/faculty-sheets.ts`:

```typescript
export const facultySheets = {
  "Faculty A": "your-sheet-id-1",
  "Faculty B": "your-sheet-id-2",
  // Add more faculty as needed
};
```

### 4. Google Sheets Structure

Each faculty sheet should have the following tabs:
- `Course Completion`
- `Class Taken`
- `Unit Test`
- `Internal 1`
- `Internal 2`
- `Model`

**Important**: For the `Class Taken` tab, ensure today's date is present for it to be marked as ✅.

### 5. Run the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`.

## Usage

1. **Login**: Use the HOD credentials set in your environment variables
2. **Dashboard**: View all faculty status cards showing completion for each tab
3. **Search**: Use the search bar to filter faculty by name
4. **Refresh**: Click the refresh button to get the latest data from Google Sheets
5. **Status Indicators**:
   - ✅ = Tab has data
   - ❌ = Tab is empty or missing today's date (for Class Taken)

## Color Coding

- **Green**: All tabs completed
- **Yellow**: Some tabs missing
- **Red**: All tabs empty

## API Endpoints

### `GET /api/faculty-status`

Returns the status of all faculty sheets.

**Response**:
```json
{
  "Faculty A": {
    "Course Completion": true,
    "Class Taken": true,
    "Unit Test": false,
    "Internal 1": true,
    "Internal 2": false,
    "Model": true
  },
  "Faculty B": { ... }
}
```

## Project Structure

```
src/
├── app/
│   ├── api/faculty-status/          # API route for faculty data
│   ├── dashboard/                   # Protected dashboard pages
│   ├── login/                       # Authentication pages
│   └── layout.tsx                   # Root layout
├── components/
│   └── FacultyStatusDashboard.tsx   # Main dashboard component
└── lib/
    ├── auth.ts                      # Authentication utilities
    ├── faculty-sheets.ts            # Sheet configuration
    └── google-sheets.ts             # Google Sheets API integration
```

## Security Features

- JWT-based authentication
- Protected API routes
- Session management with HTTP-only cookies
- Environment-based configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
