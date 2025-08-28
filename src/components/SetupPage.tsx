'use client';

import { useState } from 'react';
import { getSharingInstructions } from '@/lib/google-sheets-utils';
import { facultySheets } from '@/lib/faculty-sheets';

const SetupPage = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setTestResults({});
    
    try {
      const response = await fetch('/api/faculty-status');
      const data = await response.json();
      
      if (response.ok) {
        // Test was successful
        const results: Record<string, boolean> = {};
        Object.keys(data).forEach(faculty => {
          results[faculty] = true;
        });
        setTestResults(results);
      } else {
        // Test failed - mark all as false
        const results: Record<string, boolean> = {};
        Object.keys(facultySheets).forEach(faculty => {
          results[faculty] = false;
        });
        setTestResults(results);
      }
    } catch (error) {
      console.error('Test failed:', error);
      const results: Record<string, boolean> = {};
      Object.keys(facultySheets).forEach(faculty => {
        results[faculty] = false;
      });
      setTestResults(results);
    }
    
    setTesting(false);
  };

  const sharingInstructions = getSharingInstructions();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Google Sheets Setup
            </h1>
            
            <div className="space-y-8">
              {/* Instructions */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Share Google Sheets with Service Account
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <pre className="text-sm text-blue-800 whitespace-pre-wrap">
                    {sharingInstructions}
                  </pre>
                </div>
              </div>

              {/* Faculty Sheets List */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Faculty Sheets to Configure
                </h2>
                <div className="space-y-3">
                  {Object.entries(facultySheets).map(([faculty, sheetId]) => (
                    <div key={faculty} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                      <div>
                        <h3 className="font-medium text-gray-900">{faculty}</h3>
                        <p className="text-sm text-gray-600">Sheet ID: {sheetId}</p>
                        <a
                          href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Open Sheet →
                        </a>
                      </div>
                      <div className="flex items-center">
                        {testResults[faculty] === true && (
                          <span className="text-green-600 text-2xl">✅</span>
                        )}
                        {testResults[faculty] === false && (
                          <span className="text-red-600 text-2xl">❌</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Connection */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Test Connection
                </h2>
                <button
                  onClick={testConnection}
                  disabled={testing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {testing && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  )}
                  {testing ? 'Testing...' : 'Test Google Sheets Access'}
                </button>
                
                {Object.keys(testResults).length > 0 && (
                  <div className="mt-4 p-4 border rounded-md">
                    <h3 className="font-medium text-gray-900 mb-2">Test Results:</h3>
                    <div className="space-y-1">
                      {Object.entries(testResults).map(([faculty, success]) => (
                        <div key={faculty} className="flex items-center gap-2">
                          <span className={success ? 'text-green-600' : 'text-red-600'}>
                            {success ? '✅' : '❌'}
                          </span>
                          <span className="text-sm text-gray-700">{faculty}</span>
                        </div>
                      ))}
                    </div>
                    
                    {Object.values(testResults).every(Boolean) && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-green-800 text-sm">
                          🎉 All sheets are accessible! You can now go to the{' '}
                          <a href="/dashboard" className="text-green-600 hover:text-green-800 font-medium">
                            dashboard
                          </a>
                          .
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
