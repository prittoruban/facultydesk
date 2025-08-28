'use client';

import React from 'react';
import { sheetTabs } from '@/lib/faculty-sheets';
import { UI_CONSTANTS } from '@/lib/constants';
import { type FacultyCardProps } from '@/types/faculty';

const FacultyCard = ({ name, status, lastUpdated }: FacultyCardProps) => {
  const filledTabs = Object.values(status).filter(Boolean).length;
  const totalTabs = Object.keys(status).length;
  
  // Determine card color based on completion
  const getCardColor = (): string => {
    if (filledTabs === totalTabs) return UI_CONSTANTS.COLORS.GREEN;
    if (filledTabs > 0) return UI_CONSTANTS.COLORS.YELLOW;
    return UI_CONSTANTS.COLORS.RED;
  };

  const getStatusIcon = (filled: boolean): string => {
    return filled ? UI_CONSTANTS.ICONS.COMPLETED : UI_CONSTANTS.ICONS.NOT_COMPLETED;
  };

  const getProgressPercentage = (): number => {
    return totalTabs > 0 ? Math.round((filledTabs / totalTabs) * 100) : 0;
  };

  const formatLastUpdated = (timestamp?: string): string => {
    if (!timestamp) return new Date().toLocaleString();
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return new Date().toLocaleString();
    }
  };

  return (
    <div className={`group relative p-6 rounded-xl ${getCardColor()} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}>
      {/* Header with progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate pr-2">{name}</h3>
        <div className="flex flex-col items-end">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {filledTabs}/{totalTabs} completed
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {getProgressPercentage()}%
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-500 ease-in-out"
            style={{ 
              width: `${getProgressPercentage()}%`,
              backgroundColor: filledTabs === totalTabs ? '#10b981' : filledTabs > 0 ? '#f59e0b' : '#ef4444'
            }}
          ></div>
        </div>
      </div>
      
      {/* Tabs status */}
      <div className="space-y-3 mb-4">
        {sheetTabs.map((tab, index) => (
          <div 
            key={tab} 
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tab}</span>
            <span 
              className={`text-lg transition-transform duration-200 ${status[tab] ? 'scale-110' : ''}`}
              role="img"
              aria-label={status[tab] ? 'Completed' : 'Not completed'}
            >
              {getStatusIcon(status[tab])}
            </span>
          </div>
        ))}
      </div>
      
      {/* Footer with timestamp */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last updated:
          </p>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {formatLastUpdated(lastUpdated)}
          </p>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 rounded-xl transition-colors duration-300 pointer-events-none"></div>
    </div>
  );
};

export default FacultyCard;
