// IPC channel constants for transaction database operations
export const TRANSACTION_CHANNELS = {
    // Basic CRUD operations
    ADD_TRANSACTION: 'transaction:add',
    ADD_TRANSACTIONS: 'transaction:add-bulk',
    UPDATE_TRANSACTION: 'transaction:update',
    REMOVE_TRANSACTION: 'transaction:remove',
    GET_TRANSACTION_BY_ID: 'transaction:get-by-id',
    GET_ALL_TRANSACTIONS: 'transaction:get-all',

    // Search operations
    GET_TRANSACTIONS_BY_DATE_RANGE: 'transaction:get-by-date-range',
    GET_TRANSACTIONS_BY_USER: 'transaction:get-by-user',
    GET_TRANSACTIONS_BY_CATEGORY: 'transaction:get-by-category',
    SEARCH_TRANSACTIONS: 'transaction:search',

    // Utility operations
    GET_TRANSACTION_COUNT: 'transaction:count',
    GET_TRANSACTIONS_PAGINATED: 'transaction:paginated',

    // Database operations
    BACKUP_DATABASE: 'transaction:backup',

    // Database file operations
    LOAD_DATABASE: 'database:load',
    CREATE_DATABASE: 'database:create',
    CLOSE_DATABASE: 'database:close',
    IS_DATABASE_LOADED: 'database:is-loaded',
    GET_DATABASE_PATH: 'database:get-path',
    SELECT_DATABASE_FILE: 'database:select-file',
    SAVE_DATABASE_FILE: 'database:save-file',
} as const;

export type TransactionChannel = typeof TRANSACTION_CHANNELS[keyof typeof TRANSACTION_CHANNELS];
