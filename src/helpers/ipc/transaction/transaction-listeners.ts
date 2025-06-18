import { ipcMain, dialog } from 'electron';
import { TransactionDB } from '../../../model/db';
import { Transaction } from '../../../model/model';
import { TRANSACTION_CHANNELS } from './transaction-channels';

let listenersRegistered = false;

/**
 * Register all transaction-related IPC listeners
 */
export function addTransactionEventListeners() {
    if (listenersRegistered) {
        return;
    }

    const db = TransactionDB.getInstance();

    // Database file operations
    ipcMain.handle(TRANSACTION_CHANNELS.LOAD_DATABASE, (_, filePath: string) => {
        return db.loadDatabase(filePath);
    });

    ipcMain.handle(TRANSACTION_CHANNELS.CREATE_DATABASE, (_, filePath: string) => {
        return db.createDatabase(filePath);
    });

    ipcMain.handle(TRANSACTION_CHANNELS.CLOSE_DATABASE, () => {
        db.closeDatabase();
        return true;
    });

    ipcMain.handle(TRANSACTION_CHANNELS.IS_DATABASE_LOADED, () => {
        return db.isLoaded;
    });

    ipcMain.handle(TRANSACTION_CHANNELS.GET_DATABASE_PATH, () => {
        return db.currentDbPath;
    });

    ipcMain.handle(TRANSACTION_CHANNELS.SELECT_DATABASE_FILE, async (event) => {
        const result = await dialog.showOpenDialog({
            title: 'Select Database File',
            filters: [
                { name: 'SQLite Database', extensions: ['db', 'sqlite', 'sqlite3'] },
                { name: 'All Files', extensions: ['*'] }
            ],
            properties: ['openFile']
        });

        if (!result.canceled && result.filePaths.length > 0) {
            return result.filePaths[0];
        }
        return null;
    });

    ipcMain.handle(TRANSACTION_CHANNELS.SAVE_DATABASE_FILE, async (event) => {
        const result = await dialog.showSaveDialog({
            title: 'Create New Database',
            defaultPath: 'transactions.db',
            filters: [
                { name: 'SQLite Database', extensions: ['db'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });

        if (!result.canceled && result.filePath) {
            return result.filePath;
        }
        return null;
    });

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

    listenersRegistered = true;
}
