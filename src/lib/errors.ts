export class GoogleSheetsError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'GoogleSheetsError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export const handleApiError = (error: unknown): never => {
  if (error instanceof GoogleSheetsError || error instanceof AuthenticationError) {
    throw error;
  }
  
  if (error instanceof Error) {
    throw new GoogleSheetsError(`Unexpected error: ${error.message}`, error);
  }
  
  throw new GoogleSheetsError('An unknown error occurred');
};
