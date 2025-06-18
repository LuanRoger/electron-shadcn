import { randomUUID } from 'crypto';
import { Transaction, Category } from './model';

/**
 * Generate a unique transaction ID
 */
export function generateTransactionId(): string {
    return randomUUID();
}

/**
 * Create a new transaction with default values
 */
export function createTransaction(
    user: string,
    source: string,
    date: Date,
    amount: number,
    currency: string,
    usage: string,
    options?: {
        id?: string;
        iban?: string;
        other_party_iban?: string;
        other_party?: string;
        category?: Category;
    }
): Transaction {
    return {
        id: options?.id || generateTransactionId(),
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
    };
}

/**
 * Create a category object
 */
export function createCategory(name: string, subcategory?: string): Category {
    return {
        name,
        subcategory,
    };
}

/**
 * Validate transaction data
 */
export function validateTransaction(transaction: Partial<Transaction>): string[] {
    const errors: string[] = [];

    if (!transaction.id) {
        errors.push('Transaction ID is required');
    }

    if (!transaction.user) {
        errors.push('User is required');
    }

    if (!transaction.source) {
        errors.push('Source is required');
    }

    if (!transaction.date) {
        errors.push('Date is required');
    } else if (!(transaction.date instanceof Date) || isNaN(transaction.date.getTime())) {
        errors.push('Date must be a valid Date object');
    }

    if (transaction.amount === undefined || transaction.amount === null) {
        errors.push('Amount is required');
    } else if (typeof transaction.amount !== 'number' || isNaN(transaction.amount)) {
        errors.push('Amount must be a valid number');
    }

    if (!transaction.currency) {
        errors.push('Currency is required');
    } else if (transaction.currency.length !== 3) {
        errors.push('Currency must be a 3-letter code (e.g., EUR, USD)');
    }

    if (!transaction.usage) {
        errors.push('Usage description is required');
    }

    return errors;
}

/**
 * Format currency amount for display
 */
export function formatCurrency(amount: number, currency: string): string {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    } catch (error) {
        return `${amount} ${currency}`;
    }
}

/**
 * Parse date from various formats
 */
export function parseDate(dateInput: string | Date | number): Date {
    if (dateInput instanceof Date) {
        return dateInput;
    }

    if (typeof dateInput === 'number') {
        // Check if the number is likely to be in seconds (Unix timestamp from Python)
        // or milliseconds (JavaScript timestamp)
        // Timestamps before year 2001 in milliseconds would be less than 1000000000000
        // but in seconds would be less than 1000000000 (year ~2001)
        if (dateInput < 10000000000) {
            // Likely seconds (Python datetime.timestamp() format)
            return new Date(dateInput * 1000);
        } else {
            // Likely milliseconds (JavaScript Date.getTime() format)
            return new Date(dateInput);
        }
    }

    // Try to parse string date
    const parsed = new Date(dateInput);
    if (isNaN(parsed.getTime())) {
        throw new Error(`Invalid date format: ${dateInput}`);
    }

    return parsed;
}

/**
 * Convert JavaScript Date to Unix timestamp in seconds (Python compatible)
 */
export function dateToUnixSeconds(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}

/**
 * Convert Unix timestamp in seconds to JavaScript Date
 */
export function unixSecondsToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
}

/**
 * Get date range for common periods
 */
export function getDateRange(period: 'today' | 'week' | 'month' | 'year' | 'all'): {
    startDate?: Date;
    endDate?: Date;
} {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (period) {
        case 'today':
            return {
                startDate: today,
                endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
            };

        case 'week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);
            return {
                startDate: weekStart,
                endDate: weekEnd,
            };

        case 'month':
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            return {
                startDate: monthStart,
                endDate: monthEnd,
            };

        case 'year':
            const yearStart = new Date(now.getFullYear(), 0, 1);
            const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            return {
                startDate: yearStart,
                endDate: yearEnd,
            };

        case 'all':
        default:
            return {};
    }
}
