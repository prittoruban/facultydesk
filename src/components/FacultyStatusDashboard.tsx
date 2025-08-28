'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { type FacultyData } from '@/lib/faculty-sheets';
import { type FacultyStatusResponse } from '@/types/faculty';
import { API_ENDPOINTS, UI_CONSTANTS } from '@/lib/constants';
import FacultyCard from './FacultyCard';
import SearchControls from './SearchControls';
import ErrorDisplay from './ErrorDisplay';
import LoadingSpinner from './LoadingSpinner';

const FacultyStatusDashboard = () => {
  const [facultyData, setFacultyData] = useState<FacultyData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchFacultyStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.FACULTY_STATUS, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch faculty status');
      }
      
      const data: FacultyStatusResponse = await response.json();
      setFacultyData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchFacultyStatus();
  }, [fetchFacultyStatus]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchFacultyStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchFacultyStatus]);

  // Memoized filtered faculty data
  const filteredFaculty = useMemo(() => {
    return Object.entries(facultyData).filter(([name]) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [facultyData, searchTerm]);

  // Memoized statistics
  const statistics = useMemo(() => {
    const totalFaculty = Object.keys(facultyData).length;
    const completedFaculty = Object.values(facultyData).filter(status => {
      const filledTabs = Object.values(status).filter(Boolean).length;
      const totalTabs = Object.keys(status).length;
      return filledTabs === totalTabs;
    }).length;
    
    return {
      total: totalFaculty,
      completed: completedFaculty,
      pending: totalFaculty - completedFaculty,
      completionRate: totalFaculty > 0 ? Math.round((completedFaculty / totalFaculty) * 100) : 0
    };
  }, [facultyData]);

  if (loading && Object.keys(facultyData).length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner 
          size="lg" 
          text={UI_CONSTANTS.MESSAGES.LOADING}
          className="text-center"
        />
      </div>
    );
  }

  if (error && Object.keys(facultyData).length === 0) {
    return (
      <ErrorDisplay 
        error={error} 
        onRetry={fetchFacultyStatus}
        showSetupLink={true}
        className="max-w-2xl mx-auto"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {Object.keys(facultyData).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statistics.total}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Faculty</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statistics.completed}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statistics.pending}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statistics.completionRate}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Controls */}
      <SearchControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={fetchFacultyStatus}
        isLoading={loading}
      />

      {/* Error Banner (if error but we have cached data) */}
      {error && Object.keys(facultyData).length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 dark:text-red-200 text-sm">
              Unable to refresh data: {error}. Showing cached results.
            </p>
          </div>
        </div>
      )}

      {/* Faculty Grid */}
      {filteredFaculty.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {searchTerm ? 'No faculty found' : 'No faculty data available'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {searchTerm 
              ? `No faculty members match "${searchTerm}". Try adjusting your search terms.`
              : UI_CONSTANTS.MESSAGES.NO_DATA
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFaculty.map(([name, status], index) => (
              <div
                key={name}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in"
              >
                <FacultyCard 
                  name={name} 
                  status={status} 
                  lastUpdated={lastUpdated?.toISOString()} 
                />
              </div>
            ))}
          </div>
          
          {/* Results Summary */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredFaculty.length} of {statistics.total} faculty members
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
            {lastUpdated && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FacultyStatusDashboard;
