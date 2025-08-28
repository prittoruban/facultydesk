import { ERROR_MESSAGES, SERVICE_ACCOUNT_EMAIL } from '@/lib/constants';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
  showSetupLink?: boolean;
}

const ErrorDisplay = ({ error, onRetry, showSetupLink = false }: ErrorDisplayProps) => {
  const isPermissionError = error.includes('Permission denied') || error.includes('permission');
  
  return (
    <div className="text-center py-12">
      <div className="text-red-600 mb-4">
        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isPermissionError ? ERROR_MESSAGES.PERMISSION_TITLE : ERROR_MESSAGES.GENERIC_TITLE}
      </h3>
      <p className="text-gray-600 mb-4">{error}</p>
      
      {isPermissionError && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-left max-w-2xl mx-auto">
          <p className="text-yellow-800 text-sm mb-2">
            <strong>{ERROR_MESSAGES.QUICK_FIX}</strong>
          </p>
          <code className="text-xs bg-yellow-100 px-2 py-1 rounded font-mono">
            {SERVICE_ACCOUNT_EMAIL}
          </code>
        </div>
      )}
      
      <div className="space-x-4">
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          {ERROR_MESSAGES.RETRY_BUTTON}
        </button>
        {isPermissionError && showSetupLink && (
          <a
            href="/setup"
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors inline-block"
          >
            {ERROR_MESSAGES.SETUP_BUTTON}
          </a>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
