# Transaction Database Module

This module provides a comprehensive SQLite-based database solution for managing financial transactions in an Electron application.

## Features

- **CRUD Operations**: Create, Read, Update, Delete transactions
- **Advanced Search**: Filter by date range, category, amount, text search
- **Pagination**: Handle large datasets efficiently
- **Type Safety**: Full TypeScript support with proper interfaces
- **SQLite Storage**: Persistent local storage with indexing
- **Category Support**: Hierarchical categorization system

## Quick Start

### Basic Usage

```typescript
import { TransactionDB, createTransaction, createCategory } from './model';

// Initialize database
const db = TransactionDB.getInstance();

// Create a transaction
const transaction = createTransaction(
  'user123',
  'bank',
  new Date(),
  -50.25,
  'EUR',
  'Grocery shopping',
  {
    category: createCategory('Food', 'Groceries'),
    other_party: 'SuperMarket Ltd'
  }
);

// Add to database
const success = db.addTransaction(transaction);
```

### Search Operations

```typescript
// Search by date range
const transactions = db.getTransactionsByDateRange(
  new Date('2025-06-01'),
  new Date('2025-06-30')
);

// Search by category
const foodExpenses = db.getTransactionsByCategory('Food');
const groceries = db.getTransactionsByCategory('Food', 'Groceries');

// Advanced search with filters
const results = db.searchTransactions({
  user: 'user123',
  categoryName: 'Food',
  startDate: new Date('2025-06-01'),
  maxAmount: 0, // Only expenses
  searchText: 'market' // Search in usage and other_party
});
```

### Pagination

```typescript
const page = db.getTransactionsPaginated(1, 20); // Page 1, 20 items
console.log(`Page ${page.page} of ${page.totalPages}`);
console.log(`Showing ${page.transactions.length} of ${page.total} transactions`);
```

## API Reference

### TransactionDB Class

#### Core Methods
- `addTransaction(transaction: Transaction): boolean`
- `addTransactions(transactions: Transaction[]): boolean`
- `updateTransaction(transaction: Transaction): boolean`
- `removeTransaction(id: string): boolean`
- `getTransactionById(id: string): Transaction | null`
- `getAllTransactions(): Transaction[]`

#### Search Methods
- `getTransactionsByDateRange(startDate: Date, endDate: Date): Transaction[]`
- `getTransactionsByUser(user: string): Transaction[]`
- `getTransactionsByCategory(name: string, subcategory?: string): Transaction[]`
- `searchTransactions(filters: SearchFilters): Transaction[]`

#### Utility Methods
- `getTransactionCount(): number`
- `getTransactionsPaginated(page: number, limit: number): PaginatedResult`
- `backup(backupPath: string): boolean`
- `close(): void`

### Utility Functions

#### Transaction Creation
- `generateTransactionId(): string`
- `createTransaction(...args): Transaction`
- `createCategory(name: string, subcategory?: string): Category`

#### Validation
- `validateTransaction(transaction: Partial<Transaction>): string[]`

#### Formatting
- `formatCurrency(amount: number, currency: string): string`
- `parseDate(dateInput: string | Date | number): Date`
- `getDateRange(period: 'today' | 'week' | 'month' | 'year' | 'all'): DateRange`

## Data Types

### Transaction Interface
```typescript
interface Transaction {
  id: string;
  user: string;
  source: string;
  date: Date;
  amount: number;
  currency: string;
  iban?: string;
  other_party_iban?: string;
  other_party?: string;
  usage: string;
  category?: Category;
}
```

### Category Interface
```typescript
interface Category {
  name: string;
  subcategory?: string;
}
```

## Database Schema

The SQLite database uses the following schema:

```sql
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  user TEXT NOT NULL,
  source TEXT NOT NULL,
  date INTEGER NOT NULL, -- Unix timestamp in seconds (Python datetime.timestamp() compatible)
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  iban TEXT,
  other_party_iban TEXT,
  other_party TEXT,
  usage TEXT NOT NULL,
  category TEXT, -- JSON-serialized Category object
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Indexes for performance
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_user ON transactions(user);
CREATE INDEX idx_transactions_category ON transactions(category);
```

### Date Handling

**Important**: This database schema is compatible with Python's `datetime.timestamp()` format, which returns Unix timestamps in **seconds** (not milliseconds like JavaScript's `Date.getTime()`).

- **Storage**: Dates are stored as Unix timestamps in seconds
- **Conversion**: The database layer automatically converts between JavaScript `Date` objects and Unix seconds
- **Compatibility**: Works with existing data from Python applications using `datetime.timestamp()`

## Performance Considerations

- **Indexing**: Date, user, and category fields are indexed for fast queries
- **Pagination**: Use `getTransactionsPaginated()` for large datasets
- **Batch Operations**: Use `addTransactions()` for bulk inserts
- **JSON Storage**: Categories are stored as JSON for flexible querying

## Error Handling

All database operations include try-catch blocks and return appropriate values:
- Boolean methods return `false` on error
- Array methods return empty arrays `[]` on error
- Object methods return `null` on error
- Errors are logged to console with descriptive messages

## Examples

See `demo.ts` for a complete working example, or `examples.ts` for detailed usage patterns.

## Testing

Run the test suite with:
```bash
npm test src/tests/unit/TransactionDB.test.ts
```

## Database Location

- **Development**: `./transactions.db` in project root
- **Production**: `app.getPath('userData')/transactions.db`
- **Custom**: Specify path in constructor
