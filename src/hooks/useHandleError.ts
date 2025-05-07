import { useCallback } from 'react';

// Types

export interface UseErrorHandler {
  handleError: (error: Error) => void;
}

// Hooks

export const useErrorHandler = (): UseErrorHandler => {
  
  const handleError = useCallback((error: Error) => console.error(error), []);

  return { handleError };
};