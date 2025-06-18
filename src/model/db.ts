import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { Transaction, Category } from './model';
import { dateToUnixSeconds, unixSecondsToDate } from './utils';

/**
 * Database class for managing SQLite transactions
 */
export class TransactionDB {
    private db: Database.Database | null = null;
    private static instance: TransactionDB;
    private _isLoaded: boolean = false;
    private _currentDbPath: string | null = null;

    constructor(dbPath?: string) {
        if (dbPath) {
            this.loadDatabase(dbPath);
        }
    }

    /**
     * Get singleton instance of the database
     */
    static getInstance(dbPath?: string): TransactionDB {
        if (!TransactionDB.instance) {
            TransactionDB.instance = new TransactionDB(dbPath);
        }
        return TransactionDB.instance;
    }

    /**
     * Check if a database is currently loaded
     */
    get isLoaded(): boolean {
        return this._isLoaded;
    }

    /**
     * Get the current database path
     */
    get currentDbPath(): string | null {
        return this._currentDbPath;
    }

    /**
     * Load a database from the specified path
     */
    loadDatabase(dbPath: string): boolean {
        try {
            // Close existing database if open
            if (this.db) {
                this.db.close();
            }

            // Verify the file exists and is a valid SQLite database
            if (!require('fs').existsSync(dbPath)) {
                throw new Error(`Database file does not exist: ${dbPath}`);
            }

            this.db = new Database(dbPath);
            this._currentDbPath = dbPath;
            this._isLoaded = true;

            // Ensure the database has the correct schema
            this.initializeDatabase();

            return true;
        } catch (error) {
            console.error('Error loading database:', error);
            this.db = null;
            this._currentDbPath = null;
            this._isLoaded = false;
            return false;
        }
    }

    /**
     * Create a new database at the specified path
     */
    createDatabase(dbPath: string): boolean {
        try {
            // Close existing database if open
            if (this.db) {
                this.db.close();
            }

            this.db = new Database(dbPath);
            this._currentDbPath = dbPath;
            this._isLoaded = true;

            // Initialize the schema for the new database
            this.initializeDatabase();

            return true;
        } catch (error) {
            console.error('Error creating database:', error);
            this.db = null;
            this._currentDbPath = null;
            this._isLoaded = false;
            return false;
        }
    }

    /**
     * Close the current database
     */
    closeDatabase(): void {
        if (this.db) {
            this.db.close();
            this.db = null;
            this._currentDbPath = null;
            this._isLoaded = false;
        }
    }

    /**
     * Ensure database is loaded before operations
     */
    private ensureLoaded(): void {
        if (!this._isLoaded || !this.db) {
            throw new Error('No database loaded. Please load a database file first.');
        }
    }

    /**
     * Initialize the database schema
     */
    private initializeDatabase(): void {
        this.ensureLoaded();
        const createTableSQL = `
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        user TEXT NOT NULL,
        source TEXT NOT NULL,
        date INTEGER NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL,
        iban TEXT,
        other_party_iban TEXT,
        other_party TEXT,
        usage TEXT NOT NULL,
        category TEXT,
        created_at INTEGER DEFAULT (unixepoch()),
        updated_at INTEGER DEFAULT (unixepoch())
      )
    `;

        const createIndexSQL = `
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
      CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user);
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
    `;

        this.db!.exec(createTableSQL);
        this.db!.exec(createIndexSQL);
    }

    /**
     * Convert Transaction object to database row
     */
    private transactionToRow(transaction: Transaction): any {
        return {
            id: transaction.id,
            user: transaction.user,
            source: transaction.source,
            date: dateToUnixSeconds(transaction.date), // Store as Unix timestamp in seconds (Python compatible)
            amount: transaction.amount,
            currency: transaction.currency,
            iban: transaction.iban || null,
            other_party_iban: transaction.other_party_iban || null,
            other_party: transaction.other_party || null,
            usage: transaction.usage,
            category: transaction.category ? JSON.stringify(transaction.category) : null,
        };
    }

    /**
     * Convert database row to Transaction object
     */
    private rowToTransaction(row: any): Transaction {
        return {
            id: row.id,
            user: row.user,
            source: row.source,
            date: unixSecondsToDate(row.date), // Convert from Unix timestamp in seconds to JavaScript Date
            amount: row.amount,
            currency: row.currency,
            iban: row.iban,
            other_party_iban: row.other_party_iban,
            other_party: row.other_party,
            usage: row.usage,
            category: row.category ? JSON.parse(row.category) : null,
        };
    }

    /**
     * Add a new transaction
     */
    addTransaction(transaction: Transaction): boolean {
        this.ensureLoaded();
        try {
            const stmt = this.db!.prepare(`
        INSERT INTO transactions (
          id, user, source, date, amount, currency, iban, 
          other_party_iban, other_party, usage, category
        ) VALUES (
          @id, @user, @source, @date, @amount, @currency, @iban,
          @other_party_iban, @other_party, @usage, @category
        )
      `);

            const result = stmt.run(this.transactionToRow(transaction));
            return result.changes > 0;
        } catch (error) {
            console.error('Error adding transaction:', error);
            return false;
        }
    }

    /**
     * Add multiple transactions in a single transaction
     */
    addTransactions(transactions: Transaction[]): boolean {
        this.ensureLoaded();
        try {
            const stmt = this.db!.prepare(`
        INSERT INTO transactions (
          id, user, source, date, amount, currency, iban, 
          other_party_iban, other_party, usage, category
        ) VALUES (
          @id, @user, @source, @date, @amount, @currency, @iban,
          @other_party_iban, @other_party, @usage, @category
        )
      `);

            const insertMany = this.db!.transaction((transactions: Transaction[]) => {
                for (const transaction of transactions) {
                    stmt.run(this.transactionToRow(transaction));
                }
            });

            insertMany(transactions);
            return true;
        } catch (error) {
            console.error('Error adding transactions:', error);
            return false;
        }
    }

    /**
     * Remove a transaction by ID
     */
    removeTransaction(id: string): boolean {
        this.ensureLoaded();
        try {
            const stmt = this.db!.prepare('DELETE FROM transactions WHERE id = ?');
            const result = stmt.run(id);
            return result.changes > 0;
        } catch (error) {
            console.error('Error removing transaction:', error);
            return false;
        }
    }

    /**
     * Update an existing transaction
     */
    updateTransaction(transaction: Transaction): boolean {
        this.ensureLoaded();
        try {
            const stmt = this.db!.prepare(`
        UPDATE transactions SET
          user = @user,
          source = @source,
          date = @date,
          amount = @amount,
          currency = @currency,
          iban = @iban,
          other_party_iban = @other_party_iban,
          other_party = @other_party,
          usage = @usage,
          category = @category,
          updated_at = unixepoch()
        WHERE id = @id
      `);

            const result = stmt.run(this.transactionToRow(transaction));
            return result.changes > 0;
        } catch (error) {
            console.error('Error updating transaction:', error);
            return false;
        }
    }

    /**
     * Get all transactions
     */
    getAllTransactions(): Transaction[] {
        this.ensureLoaded();
        try {
            const stmt = this.db!.prepare('SELECT * FROM transactions ORDER BY date DESC');
            const rows = stmt.all();
            return rows.map(row => this.rowToTransaction(row));
        } catch (error) {
            console.error('Error getting all transactions:', error);
            return [];
        }
    }

    /**
     * Get transaction by ID
     */
    getTransactionById(id: string): Transaction | null {
        this.ensureLoaded();
        try {
            const stmt = this.db!.prepare('SELECT * FROM transactions WHERE id = ?');
            const row = stmt.get(id);
            return row ? this.rowToTransaction(row) : null;
        } catch (error) {
            console.error('Error getting transaction by ID:', error);
            return null;
        }
    }

    /**
     * Search transactions by date range
     */
    getTransactionsByDateRange(startDate: Date, endDate: Date): Transaction[] {
        this.ensureLoaded();
        try {
            const stmt = this.db!.prepare(`
        SELECT * FROM transactions 
        WHERE date >= ? AND date <= ? 
        ORDER BY date DESC
      `);

            const rows = stmt.all(
                dateToUnixSeconds(startDate),
                dateToUnixSeconds(endDate)
            );
            return rows.map(row => this.rowToTransaction(row));
        } catch (error) {
            console.error('Error getting transactions by date range:', error);
            return [];
        }
    }

    /**
     * Search transactions by user
     */
    getTransactionsByUser(user: string): Transaction[] {
        this.ensureLoaded();
        try {
            const stmt = this.db!.prepare(`
        SELECT * FROM transactions 
        WHERE user = ? 
        ORDER BY date DESC
      `);

            const rows = stmt.all(user);
            return rows.map(row => this.rowToTransaction(row));
        } catch (error) {
            console.error('Error getting transactions by user:', error);
            return [];
        }
    }

    /**
     * Search transactions by category
     */
    getTransactionsByCategory(categoryName: string, subcategory?: string): Transaction[] {
        this.ensureLoaded();
        try {
            let query = `
        SELECT * FROM transactions 
        WHERE category IS NOT NULL
      `;
            const params: string[] = [];

            if (subcategory) {
                query += ` AND json_extract(category, '$.name') = ? AND json_extract(category, '$.subcategory') = ?`;
                params.push(categoryName, subcategory);
            } else {
                query += ` AND json_extract(category, '$.name') = ?`;
                params.push(categoryName);
            }

            query += ` ORDER BY date DESC`;

            const stmt = this.db!.prepare(query);
            const rows = stmt.all(...params);
            return rows.map(row => this.rowToTransaction(row));
        } catch (error) {
            console.error('Error getting transactions by category:', error);
            return [];
        }
    }

    /**
     * Search transactions with filters
     */
    searchTransactions(filters: {
        user?: string;
        categoryName?: string;
        subcategory?: string;
        source?: string;
        startDate?: Date;
        endDate?: Date;
        minAmount?: number;
        maxAmount?: number;
        searchText?: string;
    }): Transaction[] {
        this.ensureLoaded();
        try {
            let query = 'SELECT * FROM transactions WHERE 1=1';
            const params: any[] = [];

            if (filters.user) {
                query += ' AND user = ?';
                params.push(filters.user);
            }

            if (filters.categoryName) {
                query += ' AND json_extract(category, "$.name") = ?';
                params.push(filters.categoryName);
            }

            if (filters.subcategory) {
                query += ' AND json_extract(category, "$.subcategory") = ?';
                params.push(filters.subcategory);
            }

            if (filters.source) {
                query += ' AND source = ?';
                params.push(filters.source);
            }

            if (filters.startDate) {
                query += ' AND date >= ?';
                params.push(dateToUnixSeconds(filters.startDate));
            }

            if (filters.endDate) {
                query += ' AND date <= ?';
                params.push(dateToUnixSeconds(filters.endDate));
            }

            if (filters.minAmount !== undefined) {
                query += ' AND amount >= ?';
                params.push(filters.minAmount);
            }

            if (filters.maxAmount !== undefined) {
                query += ' AND amount <= ?';
                params.push(filters.maxAmount);
            }

            if (filters.searchText) {
                query += ' AND (usage LIKE ? OR other_party LIKE ?)';
                const searchPattern = `%${filters.searchText}%`;
                params.push(searchPattern, searchPattern);
            }

            query += ' ORDER BY date DESC';

            const stmt = this.db!.prepare(query);
            const rows = stmt.all(...params);
            return rows.map(row => this.rowToTransaction(row));
        } catch (error) {
            console.error('Error searching transactions:', error);
            return [];
        }
    }

    /**
     * Get transaction count
     */
    getTransactionCount(): number {
        this.ensureLoaded();
        try {
            const stmt = this.db!.prepare('SELECT COUNT(*) as count FROM transactions');
            const result = stmt.get() as { count: number };
            return result.count;
        } catch (error) {
            console.error('Error getting transaction count:', error);
            return 0;
        }
    }

    /**
     * Get transactions with pagination
     */
    getTransactionsPaginated(page: number = 1, limit: number = 50): {
        transactions: Transaction[];
        total: number;
        page: number;
        totalPages: number;
    } {
        this.ensureLoaded();
        try {
            const offset = (page - 1) * limit;

            const countStmt = this.db!.prepare('SELECT COUNT(*) as count FROM transactions');
            const total = (countStmt.get() as { count: number }).count;

            const stmt = this.db!.prepare(`
        SELECT * FROM transactions 
        ORDER BY date DESC 
        LIMIT ? OFFSET ?
      `);

            const rows = stmt.all(limit, offset);
            const transactions = rows.map(row => this.rowToTransaction(row));

            return {
                transactions,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error('Error getting paginated transactions:', error);
            return {
                transactions: [],
                total: 0,
                page: 1,
                totalPages: 0
            };
        }
    }

    /**
     * Close the database connection
     */
    close(): void {
        if (this.db) {
            this.db.close();
            this.db = null;
            this._currentDbPath = null;
            this._isLoaded = false;
        }
    }

    /**
     * Execute a backup of the database
     */
    backup(backupPath: string): boolean {
        this.ensureLoaded();
        try {
            this.db!.backup(backupPath);
            return true;
        } catch (error) {
            console.error('Error creating backup:', error);
            return false;
        }
    }
}