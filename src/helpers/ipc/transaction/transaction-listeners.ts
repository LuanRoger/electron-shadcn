import { ipcMain } from 'electron';
import { TransactionDB } from '../../../model/db';
import { Transaction } from '../../../model/model';
import { TRANSACTION_CHANNELS } from './transaction-channels';

/**
 * Register all transaction-related IPC listeners
 */
export function addTransactionEventListeners() {
    const db = TransactionDB.getInstance();

    // Basic CRUD operations
    ipcMain.handle(TRANSACTION_CHANNELS.ADD_TRANSACTION, (_, transaction: Transaction) => {
        return db.addTransaction(transaction);
    });

    ipcMain.handle(TRANSACTION_CHANNELS.ADD_TRANSACTIONS, (_, transactions: Transaction[]) => {
        return db.addTransactions(transactions);
    });

    ipcMain.handle(TRANSACTION_CHANNELS.UPDATE_TRANSACTION, (_, transaction: Transaction) => {
        return db.updateTransaction(transaction);
    });

    ipcMain.handle(TRANSACTION_CHANNELS.REMOVE_TRANSACTION, (_, id: string) => {
        return db.removeTransaction(id);
    });

    ipcMain.handle(TRANSACTION_CHANNELS.GET_TRANSACTION_BY_ID, (_, id: string) => {
        return db.getTransactionById(id);
    });

    ipcMain.handle(TRANSACTION_CHANNELS.GET_ALL_TRANSACTIONS, () => {
        return db.getAllTransactions();
    });

    // Search operations
    ipcMain.handle(TRANSACTION_CHANNELS.GET_TRANSACTIONS_BY_DATE_RANGE,
        (_, startDate: string, endDate: string) => {
            return db.getTransactionsByDateRange(new Date(startDate), new Date(endDate));
        }
    );

    ipcMain.handle(TRANSACTION_CHANNELS.GET_TRANSACTIONS_BY_USER, (_, user: string) => {
        return db.getTransactionsByUser(user);
    });

    ipcMain.handle(TRANSACTION_CHANNELS.GET_TRANSACTIONS_BY_CATEGORY,
        (_, name: string, subcategory?: string) => {
            return db.getTransactionsByCategory(name, subcategory);
        }
    );

    ipcMain.handle(TRANSACTION_CHANNELS.SEARCH_TRANSACTIONS, (_, filters: any) => {
        // Convert date strings back to Date objects if present
        const processedFilters = { ...filters };
        if (processedFilters.startDate) {
            processedFilters.startDate = new Date(processedFilters.startDate);
        }
        if (processedFilters.endDate) {
            processedFilters.endDate = new Date(processedFilters.endDate);
        }
        return db.searchTransactions(processedFilters);
    });

    // Utility operations
    ipcMain.handle(TRANSACTION_CHANNELS.GET_TRANSACTION_COUNT, () => {
        return db.getTransactionCount();
    });

    ipcMain.handle(TRANSACTION_CHANNELS.GET_TRANSACTIONS_PAGINATED,
        (_, page: number, limit: number) => {
            return db.getTransactionsPaginated(page, limit);
        }
    );

    // Database operations
    ipcMain.handle(TRANSACTION_CHANNELS.BACKUP_DATABASE, (_, backupPath: string) => {
        return db.backup(backupPath);
    });
}
