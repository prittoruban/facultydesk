'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchFacultyStatus();
  }, []);

  const fetchFacultyStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.FACULTY_STATUS);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch faculty status');
      }
      
      const data: FacultyStatusResponse = await response.json();
      setFacultyData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredFaculty = Object.entries(facultyData).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto" />
          <p className="mt-4 text-gray-600">{UI_CONSTANTS.MESSAGES.LOADING}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        onRetry={fetchFacultyStatus}
        showSetupLink={true}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SearchControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={fetchFacultyStatus}
        isLoading={loading}
      />

      {filteredFaculty.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm ? UI_CONSTANTS.MESSAGES.NO_RESULTS : UI_CONSTANTS.MESSAGES.NO_DATA}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map(([name, status]) => (
            <FacultyCard key={name} name={name} status={status} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyStatusDashboard;
