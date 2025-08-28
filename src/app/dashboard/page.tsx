import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LogoutButton from '@/app/dashboard/LogoutButton';
import FacultyStatusDashboard from '@/components/FacultyStatusDashboard';
import ErrorBoundary from '@/components/ErrorBoundary';

export default async function Dashboard() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Header */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Faculty Desk
                </h1>
              </div>
              
              <div className="hidden md:flex space-x-1">
                <a
                  href="/dashboard"
                  className="bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </a>
                <a
                  href="/setup"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Setup
                </a>
              </div>
            </div>

            {/* Right side - User info and actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    HOD Dashboard
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {String(session.email)}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Faculty Status Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Monitor the completion status of faculty data across all required tabs. 
              Track progress and ensure all information is up to date.
            </p>
          </div>
        </div>
        
        {/* Dashboard Content with Error Boundary */}
        <ErrorBoundary>
          <FacultyStatusDashboard />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2025 Faculty Desk. Built with Next.js and Google Sheets API.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
