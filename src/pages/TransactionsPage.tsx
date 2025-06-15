import React, { useState } from 'react';
import { useTransactionDB, transactionUtils } from '../hooks/useTransactionDB';
import { Button } from '../components/ui/button';
import type { Transaction, Category } from '../model/model';

export function TransactionsPage() {
    const {
        transactions,
        loading,
        error,
        addTransaction,
        removeTransaction,
        updateTransaction,
        searchTransactions,
        getTransactionCount,
        clearError,
    } = useTransactionDB();

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [searchFilters, setSearchFilters] = useState({
        searchText: '',
        categoryName: '',
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: '',
    });

    // Add sample transaction
    const handleAddSampleTransaction = async () => {
        const sampleTransaction = transactionUtils.createTransaction(
            'demo-user',
            'bank',
            new Date(),
            -Math.floor(Math.random() * 100) - 10, // Random expense between -10 and -110
            'EUR',
            `Sample transaction ${Date.now()}`,
            {
                category: transactionUtils.createCategory('Sample', 'Demo'),
                other_party: 'Sample Store',
            }
        );

        await addTransaction(sampleTransaction);
    };

    // Add sample income
    const handleAddSampleIncome = async () => {
        const incomeTransaction = transactionUtils.createTransaction(
            'demo-user',
            'bank',
            new Date(),
            Math.floor(Math.random() * 1000) + 100, // Random income between 100 and 1100
            'EUR',
            'Sample income payment',
            {
                category: transactionUtils.createCategory('Income', 'Salary'),
                other_party: 'Sample Employer',
            }
        );

        await addTransaction(incomeTransaction);
    };

    // Handle search
    const handleSearch = async () => {
        const filters: any = {};

        if (searchFilters.searchText) filters.searchText = searchFilters.searchText;
        if (searchFilters.categoryName) filters.categoryName = searchFilters.categoryName;
        if (searchFilters.startDate) filters.startDate = new Date(searchFilters.startDate);
        if (searchFilters.endDate) filters.endDate = new Date(searchFilters.endDate);
        if (searchFilters.minAmount) filters.minAmount = parseFloat(searchFilters.minAmount);
        if (searchFilters.maxAmount) filters.maxAmount = parseFloat(searchFilters.maxAmount);

        await searchTransactions(filters);
    };

    // Clear search filters
    const handleClearSearch = () => {
        setSearchFilters({
            searchText: '',
            categoryName: '',
            startDate: '',
            endDate: '',
            minAmount: '',
            maxAmount: '',
        });
    };

    // Calculate statistics
    const income = transactionUtils.calculateTotal(transactionUtils.filterByType(transactions, 'income'));
    const expenses = Math.abs(transactionUtils.calculateTotal(transactionUtils.filterByType(transactions, 'expense')));
    const balance = income - expenses;

    const groupedByCategory = transactionUtils.groupByCategory(transactions);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Transactions</h1>

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <div className="flex justify-between items-center">
                        <span>{error}</span>
                        <Button variant="ghost" size="sm" onClick={clearError}>×</Button>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-4 mb-6">
                <Button onClick={handleAddSampleTransaction} disabled={loading}>
                    Add Sample Expense
                </Button>
                <Button onClick={handleAddSampleIncome} disabled={loading}>
                    Add Sample Income
                </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border">
                    <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
                    <p className="text-2xl font-bold">{transactions.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow border">
                    <h3 className="text-sm font-medium text-green-600">Income</h3>
                    <p className="text-2xl font-bold text-green-700">
                        {transactionUtils.formatCurrency(income, 'EUR')}
                    </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg shadow border">
                    <h3 className="text-sm font-medium text-red-600">Expenses</h3>
                    <p className="text-2xl font-bold text-red-700">
                        {transactionUtils.formatCurrency(expenses, 'EUR')}
                    </p>
                </div>
                <div className={`p-4 rounded-lg shadow border ${balance >= 0 ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                    <h3 className={`text-sm font-medium ${balance >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
                        Balance
                    </h3>
                    <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-yellow-700'}`}>
                        {transactionUtils.formatCurrency(balance, 'EUR')}
                    </p>
                </div>
            </div>

            {/* Search Filters */}
            <div className="bg-white p-4 rounded-lg shadow border mb-6">
                <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Search text..."
                        value={searchFilters.searchText}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, searchText: e.target.value }))}
                        className="border rounded px-3 py-2"
                    />
                    <input
                        type="text"
                        placeholder="Category name..."
                        value={searchFilters.categoryName}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, categoryName: e.target.value }))}
                        className="border rounded px-3 py-2"
                    />
                    <input
                        type="date"
                        placeholder="Start date"
                        value={searchFilters.startDate}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        className="border rounded px-3 py-2"
                    />
                    <input
                        type="date"
                        placeholder="End date"
                        value={searchFilters.endDate}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        className="border rounded px-3 py-2"
                    />
                    <input
                        type="number"
                        placeholder="Min amount"
                        value={searchFilters.minAmount}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                        className="border rounded px-3 py-2"
                    />
                    <input
                        type="number"
                        placeholder="Max amount"
                        value={searchFilters.maxAmount}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                        className="border rounded px-3 py-2"
                    />
                </div>
                <div className="flex gap-2 mt-4">
                    <Button onClick={handleSearch} disabled={loading}>
                        Search
                    </Button>
                    <Button variant="outline" onClick={handleClearSearch}>
                        Clear
                    </Button>
                </div>
            </div>

            {/* Category Summary */}
            <div className="bg-white p-4 rounded-lg shadow border mb-6">
                <h3 className="text-lg font-semibold mb-4">By Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(groupedByCategory).map(([category, categoryTransactions]) => {
                        const total = transactionUtils.calculateTotal(categoryTransactions);
                        return (
                            <div key={category} className="border rounded p-3">
                                <h4 className="font-medium">{category}</h4>
                                <p className="text-sm text-gray-600">{categoryTransactions.length} transactions</p>
                                <p className={`font-semibold ${total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {transactionUtils.formatCurrency(total, 'EUR')}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow border">
                <h3 className="text-lg font-semibold p-4 border-b">Recent Transactions</h3>
                {loading ? (
                    <div className="p-4 text-center">Loading...</div>
                ) : transactions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        No transactions found. Add some sample transactions to get started.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-3 font-medium">Date</th>
                                    <th className="text-left p-3 font-medium">Description</th>
                                    <th className="text-left p-3 font-medium">Category</th>
                                    <th className="text-left p-3 font-medium">Other Party</th>
                                    <th className="text-right p-3 font-medium">Amount</th>
                                    <th className="text-center p-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.slice(0, 50).map((transaction) => (
                                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-3">{transaction.usage}</td>
                                        <td className="p-3">
                                            {transaction.category?.name || 'Uncategorized'}
                                            {transaction.category?.subcategory && (
                                                <span className="text-gray-500 text-sm"> / {transaction.category.subcategory}</span>
                                            )}
                                        </td>
                                        <td className="p-3">{transaction.other_party || '-'}</td>
                                        <td className={`p-3 text-right font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {transactionUtils.formatCurrency(transaction.amount, transaction.currency)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeTransaction(transaction.id)}
                                                disabled={loading}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
