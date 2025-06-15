import { useState, useEffect, useCallback } from 'react';
import type { Transaction, Category } from '../model/model';

/**
 * React hook for interacting with the transaction database
 */
export function useTransactionDB() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper function to handle async operations
    const handleAsync = useCallback(async <T>(
        operation: () => Promise<T>,
        onSuccess?: (result: T) => void
    ): Promise<T | null> => {
        setLoading(true);
        setError(null);
        try {
            const result = await operation();
            onSuccess?.(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Load all transactions
    const loadAllTransactions = useCallback(async () => {
        return handleAsync(
            () => window.transactionDB.getAllTransactions(),
            (result) => setTransactions(result as Transaction[])
        );
    }, [handleAsync]);

    // Add a new transaction
    const addTransaction = useCallback(async (transaction: Transaction) => {
        const success = await handleAsync(() => window.transactionDB.addTransaction(transaction));
        if (success) {
            await loadAllTransactions();
        }
        return success;
    }, [handleAsync, loadAllTransactions]);

    // Add multiple transactions
    const addTransactions = useCallback(async (transactions: Transaction[]) => {
        const success = await handleAsync(() => window.transactionDB.addTransactions(transactions));
        if (success) {
            await loadAllTransactions();
        }
        return success;
    }, [handleAsync, loadAllTransactions]);

    // Update a transaction
    const updateTransaction = useCallback(async (transaction: Transaction) => {
        const success = await handleAsync(() => window.transactionDB.updateTransaction(transaction));
        if (success) {
            await loadAllTransactions();
        }
        return success;
    }, [handleAsync, loadAllTransactions]);

    // Remove a transaction
    const removeTransaction = useCallback(async (id: string) => {
        const success = await handleAsync(() => window.transactionDB.removeTransaction(id));
        if (success) {
            await loadAllTransactions();
        }
        return success;
    }, [handleAsync, loadAllTransactions]);

    // Get transaction by ID
    const getTransactionById = useCallback(async (id: string) => {
        return handleAsync(() => window.transactionDB.getTransactionById(id));
    }, [handleAsync]);

    // Search transactions by date range
    const getTransactionsByDateRange = useCallback(async (startDate: Date, endDate: Date) => {
        return handleAsync(
            () => window.transactionDB.getTransactionsByDateRange(startDate, endDate),
            (result) => setTransactions(result as Transaction[])
        );
    }, [handleAsync]);

    // Search transactions by user
    const getTransactionsByUser = useCallback(async (user: string) => {
        return handleAsync(
            () => window.transactionDB.getTransactionsByUser(user),
            (result) => setTransactions(result as Transaction[])
        );
    }, [handleAsync]);

    // Search transactions by category
    const getTransactionsByCategory = useCallback(async (name: string, subcategory?: string) => {
        return handleAsync(
            () => window.transactionDB.getTransactionsByCategory(name, subcategory),
            (result) => setTransactions(result as Transaction[])
        );
    }, [handleAsync]);

    // Advanced search
    const searchTransactions = useCallback(async (filters: {
        user?: string;
        categoryName?: string;
        subcategory?: string;
        source?: string;
        startDate?: Date;
        endDate?: Date;
        minAmount?: number;
        maxAmount?: number;
        searchText?: string;
    }) => {
        return handleAsync(
            () => window.transactionDB.searchTransactions(filters),
            (result) => setTransactions(result as Transaction[])
        );
    }, [handleAsync]);

    // Get transaction count
    const getTransactionCount = useCallback(async () => {
        return handleAsync(() => window.transactionDB.getTransactionCount());
    }, [handleAsync]);

    // Get paginated transactions
    const getTransactionsPaginated = useCallback(async (page: number, limit: number) => {
        return handleAsync(() => window.transactionDB.getTransactionsPaginated(page, limit));
    }, [handleAsync]);

    // Backup database
    const backupDatabase = useCallback(async (backupPath: string) => {
        return handleAsync(() => window.transactionDB.backupDatabase(backupPath));
    }, [handleAsync]);

    // Load all transactions on mount
    useEffect(() => {
        loadAllTransactions();
    }, [loadAllTransactions]);

    return {
        // State
        transactions,
        loading,
        error,

        // Operations
        addTransaction,
        addTransactions,
        updateTransaction,
        removeTransaction,
        getTransactionById,

        // Search operations
        loadAllTransactions,
        getTransactionsByDateRange,
        getTransactionsByUser,
        getTransactionsByCategory,
        searchTransactions,

        // Utility operations
        getTransactionCount,
        getTransactionsPaginated,
        backupDatabase,

        // Helper to clear error
        clearError: () => setError(null),
    };
}

/**
 * Utility functions for transaction management
 */
export const transactionUtils = {
    /**
     * Create a new transaction with a generated ID
     */
    createTransaction: (
        user: string,
        source: string,
        date: Date,
        amount: number,
        currency: string,
        usage: string,
        options?: {
            iban?: string;
            other_party_iban?: string;
            other_party?: string;
            category?: Category;
        }
    ): Transaction => ({
        id: crypto.randomUUID(),
        user,
        source,
        date,
        amount,
        currency,
        usage,
        iban: options?.iban,
        other_party_iban: options?.other_party_iban,
        other_party: options?.other_party,
        category: options?.category,
    }),

    /**
     * Create a category object
     */
    createCategory: (name: string, subcategory?: string): Category => ({
        name,
        subcategory,
    }),

    /**
     * Format currency for display
     */
    formatCurrency: (amount: number, currency: string): string => {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
            }).format(amount);
        } catch (error) {
            return `${amount} ${currency}`;
        }
    },

    /**
     * Calculate total for a list of transactions
     */
    calculateTotal: (transactions: Transaction[]): number => {
        return transactions.reduce((sum, t) => sum + t.amount, 0);
    },

    /**
     * Get transactions by type (income/expense)
     */
    filterByType: (transactions: Transaction[], type: 'income' | 'expense'): Transaction[] => {
        return transactions.filter(t => type === 'income' ? t.amount > 0 : t.amount < 0);
    },

    /**
     * Group transactions by category
     */
    groupByCategory: (transactions: Transaction[]): Record<string, Transaction[]> => {
        return transactions.reduce((groups, transaction) => {
            const categoryName = transaction.category?.name || 'Uncategorized';
            if (!groups[categoryName]) {
                groups[categoryName] = [];
            }
            groups[categoryName].push(transaction);
            return groups;
        }, {} as Record<string, Transaction[]>);
    },

    /**
     * Get date range presets
     */
    getDateRangePresets: () => ({
        today: {
            start: new Date(new Date().setHours(0, 0, 0, 0)),
            end: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        thisWeek: (() => {
            const now = new Date();
            const start = new Date(now);
            start.setDate(now.getDate() - now.getDay());
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            return { start, end };
        })(),
        thisMonth: {
            start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999),
        },
        thisYear: {
            start: new Date(new Date().getFullYear(), 0, 1),
            end: new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999),
        },
    }),
};
