import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TransactionDB, createTransaction, createCategory, Transaction } from '../../model';
import fs from 'fs';
import path from 'path';

describe('TransactionDB', () => {
    let db: TransactionDB;
    let testDbPath: string;

    beforeEach(() => {
        // Create a temporary database for testing
        testDbPath = path.join(process.cwd(), 'test-transactions.db');
        db = new TransactionDB(testDbPath);
    });

    afterEach(() => {
        // Clean up test database
        db.close();
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }
    });

    it('should create a new transaction', () => {
        const transaction = createTransaction(
            'testuser',
            'bank',
            new Date('2025-06-01'),
            -50.25,
            'EUR',
            'Test transaction',
            {
                category: createCategory('Food', 'Groceries'),
            }
        );

        const success = db.addTransaction(transaction);
        expect(success).toBe(true);

        const retrieved = db.getTransactionById(transaction.id);
        expect(retrieved).toBeTruthy();
        expect(retrieved?.usage).toBe('Test transaction');
        expect(retrieved?.amount).toBe(-50.25);
        expect(retrieved?.category?.name).toBe('Food');
        expect(retrieved?.category?.subcategory).toBe('Groceries');
    });

    it('should search transactions by date range', () => {
        const transaction1 = createTransaction(
            'testuser',
            'bank',
            new Date('2025-06-01'),
            -50.25,
            'EUR',
            'Transaction 1'
        );

        const transaction2 = createTransaction(
            'testuser',
            'bank',
            new Date('2025-06-05'),
            -30.00,
            'EUR',
            'Transaction 2'
        );

        const transaction3 = createTransaction(
            'testuser',
            'bank',
            new Date('2025-06-10'),
            -20.00,
            'EUR',
            'Transaction 3'
        );

        db.addTransaction(transaction1);
        db.addTransaction(transaction2);
        db.addTransaction(transaction3);

        const results = db.getTransactionsByDateRange(
            new Date('2025-06-01'),
            new Date('2025-06-05')
        );

        expect(results).toHaveLength(2);
        expect(results.some((t: Transaction) => t.usage === 'Transaction 1')).toBe(true);
        expect(results.some((t: Transaction) => t.usage === 'Transaction 2')).toBe(true);
        expect(results.some((t: Transaction) => t.usage === 'Transaction 3')).toBe(false);
    });

    it('should search transactions by category', () => {
        const transaction1 = createTransaction(
            'testuser',
            'bank',
            new Date('2025-06-01'),
            -50.25,
            'EUR',
            'Grocery shopping',
            {
                category: createCategory('Food', 'Groceries'),
            }
        );

        const transaction2 = createTransaction(
            'testuser',
            'bank',
            new Date('2025-06-02'),
            -15.99,
            'EUR',
            'Coffee',
            {
                category: createCategory('Food', 'Beverages'),
            }
        );

        const transaction3 = createTransaction(
            'testuser',
            'bank',
            new Date('2025-06-03'),
            -800.00,
            'EUR',
            'Rent',
            {
                category: createCategory('Housing', 'Rent'),
            }
        );

        db.addTransaction(transaction1);
        db.addTransaction(transaction2);
        db.addTransaction(transaction3);

        // Search by category name only
        const foodResults = db.getTransactionsByCategory('Food');
        expect(foodResults).toHaveLength(2);

        // Search by category and subcategory
        const groceryResults = db.getTransactionsByCategory('Food', 'Groceries');
        expect(groceryResults).toHaveLength(1);
        expect(groceryResults[0].usage).toBe('Grocery shopping');
    });

    it('should update transactions', () => {
        const transaction = createTransaction(
            'testuser',
            'bank',
            new Date('2025-06-01'),
            -50.25,
            'EUR',
            'Original usage'
        );

        db.addTransaction(transaction);

        // Update the transaction
        transaction.usage = 'Updated usage';
        transaction.amount = -75.50;

        const success = db.updateTransaction(transaction);
        expect(success).toBe(true);

        const updated = db.getTransactionById(transaction.id);
        expect(updated?.usage).toBe('Updated usage');
        expect(updated?.amount).toBe(-75.50);
    });

    it('should remove transactions', () => {
        const transaction = createTransaction(
            'testuser',
            'bank',
            new Date('2025-06-01'),
            -50.25,
            'EUR',
            'To be removed'
        );

        db.addTransaction(transaction);

        // Verify it exists
        let retrieved = db.getTransactionById(transaction.id);
        expect(retrieved).toBeTruthy();

        // Remove it
        const success = db.removeTransaction(transaction.id);
        expect(success).toBe(true);

        // Verify it's gone
        retrieved = db.getTransactionById(transaction.id);
        expect(retrieved).toBeNull();
    });

    it('should perform advanced search', () => {
        const transactions = [
            createTransaction('user1', 'bank', new Date('2025-06-01'), -50.25, 'EUR', 'Grocery shopping at SuperMarket', {
                other_party: 'SuperMarket GmbH',
                category: createCategory('Food', 'Groceries'),
            }),
            createTransaction('user1', 'bank', new Date('2025-06-02'), -15.99, 'EUR', 'Coffee subscription', {
                category: createCategory('Food', 'Beverages'),
            }),
            createTransaction('user2', 'bank', new Date('2025-06-03'), 2500.00, 'EUR', 'Salary payment', {
                category: createCategory('Income', 'Salary'),
            }),
        ];

        transactions.forEach(t => db.addTransaction(t));

        // Search for user1's food expenses
        const results = db.searchTransactions({
            user: 'user1',
            categoryName: 'Food',
            maxAmount: 0, // Only expenses
        });

        expect(results).toHaveLength(2);
        expect(results.every((t: Transaction) => t.user === 'user1')).toBe(true);
        expect(results.every((t: Transaction) => t.amount < 0)).toBe(true);

        // Search by text
        const textResults = db.searchTransactions({
            searchText: 'shop',
        });

        expect(textResults).toHaveLength(1);
        expect(textResults[0].usage).toContain('shopping');
    });

    it('should handle pagination', () => {
        // Add multiple transactions
        for (let i = 0; i < 5; i++) {
            const transaction = createTransaction(
                'testuser',
                'bank',
                new Date(`2025-06-0${i + 1}`),
                -10 * (i + 1),
                'EUR',
                `Transaction ${i + 1}`
            );
            db.addTransaction(transaction);
        }

        const page1 = db.getTransactionsPaginated(1, 2);
        expect(page1.transactions).toHaveLength(2);
        expect(page1.total).toBe(5);
        expect(page1.totalPages).toBe(3);
        expect(page1.page).toBe(1);

        const page2 = db.getTransactionsPaginated(2, 2);
        expect(page2.transactions).toHaveLength(2);
        expect(page2.page).toBe(2);

        const page3 = db.getTransactionsPaginated(3, 2);
        expect(page3.transactions).toHaveLength(1);
        expect(page3.page).toBe(3);
    });
});
