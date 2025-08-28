'use client';

import React, { useState } from 'react';
import { ERROR_MESSAGES, SERVICE_ACCOUNT_EMAIL } from '@/lib/constants';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
  showSetupLink?: boolean;
  className?: string;
}

const ErrorDisplay = ({ error, onRetry, showSetupLink = false, className = '' }: ErrorDisplayProps) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  
  const isPermissionError = error.includes('Permission denied') || error.includes('permission');
  
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      // Add a small delay to show the animation
      setTimeout(() => setIsRetrying(false), 500);
    }
  };

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(SERVICE_ACCOUNT_EMAIL);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 ${className}`}>
      <div className="text-center">
        {/* Error Icon */}
        <div className="text-red-500 mb-6">
          <svg 
            className="mx-auto h-16 w-16" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>

        {/* Error Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {isPermissionError ? ERROR_MESSAGES.PERMISSION_TITLE : ERROR_MESSAGES.GENERIC_TITLE}
        </h3>

        {/* Error Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {error}
        </p>
        
        {/* Permission Error Help */}
        {isPermissionError && (
          <div className="mb-8 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-left max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-amber-800 dark:text-amber-200 font-medium mb-2">
                  {ERROR_MESSAGES.QUICK_FIX}
                </h4>
                <p className="text-amber-700 dark:text-amber-300 text-sm mb-3">
                  Share your Google Sheet with this service account:
                </p>
                <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-800 p-3 rounded-lg">
                  <code className="text-sm font-mono text-amber-900 dark:text-amber-100 flex-1 break-all">
                    {SERVICE_ACCOUNT_EMAIL}
                  </code>
                  <button
                    onClick={copyEmailToClipboard}
                    className="flex-shrink-0 p-2 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors duration-200"
                    title="Copy email address"
                    aria-label="Copy service account email"
                  >
                    {emailCopied ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                {emailCopied && (
                  <p className="text-green-600 dark:text-green-400 text-xs mt-2 font-medium">
                    ✓ Email copied to clipboard!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
              ${isRetrying 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-95'
              }
            `}
          >
            {isRetrying ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retrying...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {ERROR_MESSAGES.RETRY_BUTTON}
              </>
            )}
          </button>
          
          {isPermissionError && showSetupLink && (
            <a
              href="/setup"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {ERROR_MESSAGES.SETUP_BUTTON}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
