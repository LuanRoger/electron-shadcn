import { TRANSACTION_CHANNELS } from './transaction-channels';
import { Transaction } from '../../../model/model';

/**
 * Expose transaction database context to renderer process
 */
export function exposeTransactionContext() {
    const { contextBridge, ipcRenderer } = window.require('electron');

    contextBridge.exposeInMainWorld('transactionDB', {
        // Basic CRUD operations
        addTransaction: (transaction: Transaction) =>
            ipcRenderer.invoke(TRANSACTION_CHANNELS.ADD_TRANSACTION, transaction),

        addTransactions: (transactions: Transaction[]) =>
            ipcRenderer.invoke(TRANSACTION_CHANNELS.ADD_TRANSACTIONS, transactions),

        updateTransaction: (transaction: Transaction) =>
            ipcRenderer.invoke(TRANSACTION_CHANNELS.UPDATE_TRANSACTION, transaction),

        removeTransaction: (id: string) =>
            ipcRenderer.invoke(TRANSACTION_CHANNELS.REMOVE_TRANSACTION, id),

        getTransactionById: (id: string) =>
            ipcRenderer.invoke(TRANSACTION_CHANNELS.GET_TRANSACTION_BY_ID, id),

        getAllTransactions: () =>
            ipcRenderer.invoke(TRANSACTION_CHANNELS.GET_ALL_TRANSACTIONS),

        // Search operations
        getTransactionsByDateRange: (startDate: Date, endDate: Date) =>
            ipcRenderer.invoke(TRANSACTION_CHANNELS.GET_TRANSACTIONS_BY_DATE_RANGE,
                startDate.toISOString(), endDate.toISOString()),

        getTransactionsByUser: (user: string) =>
            ipcRenderer.invoke(TRANSACTION_CHANNELS.GET_TRANSACTIONS_BY_USER, user),

        getTransactionsByCategory: (name: string, subcategory?: string) =>
            ipcRenderer.invoke(TRANSACTION_CHANNELS.GET_TRANSACTIONS_BY_CATEGORY, name, subcategory),

        searchTransactions: (filters: any) => {
            // Convert Date objects to strings for IPC transfer
            const processedFilters = { ...filters };
            if (processedFilters.startDate instanceof Date) {
                processedFilters.startDate = processedFilters.startDate.toISOString();
            }
            if (processedFilters.endDate instanceof Date) {
                processedFilters.endDate = processedFilters.endDate.toISOString();
            }
            return ipcRenderer.invoke(TRANSACTION_CHANNELS.SEARCH_TRANSACTIONS, processedFilters);
        },

        // Utility operations
        getTransactionCount: () =>
            ipcRenderer.invoke(TRANSACTION_CHANNELS.GET_TRANSACTION_COUNT),

        getTransactionsPaginated: (page: number, limit: number) =>
            ipcRenderer.invoke(TRANSACTION_CHANNELS.GET_TRANSACTIONS_PAGINATED, page, limit),

        // Database operations
        backupDatabase: (backupPath: string) =>
            ipcRenderer.invoke(TRANSACTION_CHANNELS.BACKUP_DATABASE, backupPath),
    });
}
