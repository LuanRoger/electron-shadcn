import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage database loading state
 */
export function useDatabaseLoader() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPath, setCurrentPath] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Check if database is loaded on mount
    useEffect(() => {
        checkDatabaseStatus();
    }, []);

    const checkDatabaseStatus = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const loaded = await window.transactionDB.isDatabaseLoaded();
            const path = await window.transactionDB.getDatabasePath();

            setIsLoaded(loaded);
            setCurrentPath(path);
        } catch (err) {
            console.error('Error checking database status:', err);
            setError(err instanceof Error ? err.message : 'Failed to check database status');
            setIsLoaded(false);
            setCurrentPath(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadDatabase = useCallback(async (filePath: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const success = await window.transactionDB.loadDatabase(filePath);
            if (success) {
                setIsLoaded(true);
                setCurrentPath(filePath);
                return true;
            } else {
                throw new Error('Failed to load database');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load database');
            setIsLoaded(false);
            setCurrentPath(null);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createDatabase = useCallback(async (filePath: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const success = await window.transactionDB.createDatabase(filePath);
            if (success) {
                setIsLoaded(true);
                setCurrentPath(filePath);
                return true;
            } else {
                throw new Error('Failed to create database');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create database');
            setIsLoaded(false);
            setCurrentPath(null);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const closeDatabase = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            await window.transactionDB.closeDatabase();
            setIsLoaded(false);
            setCurrentPath(null);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to close database');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoaded,
        isLoading,
        currentPath,
        error,
        checkDatabaseStatus,
        loadDatabase,
        createDatabase,
        closeDatabase,
        clearError: () => setError(null),
    };
}
