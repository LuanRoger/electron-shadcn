import React, { useState, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { FileIcon, DatabaseIcon, UploadIcon, PlusIcon } from 'lucide-react';

interface DatabaseSelectionPageProps {
    onDatabaseLoaded: () => void;
}

export function DatabaseSelectionPage({ onDatabaseLoaded }: DatabaseSelectionPageProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        setError(null);
        setIsLoading(true);

        try {
            const files = Array.from(e.dataTransfer.files);
            if (files.length === 0) {
                throw new Error('No files dropped');
            }

            const file = files[0];
            const filePath = (file as any).path || file.name;

            if (!filePath.match(/\.(db|sqlite|sqlite3)$/i)) {
                throw new Error('Invalid file type. Please select a SQLite database file (.db, .sqlite, .sqlite3)');
            }

            const success = await window.transactionDB.loadDatabase(filePath);
            if (success) {
                onDatabaseLoaded();
            } else {
                throw new Error('Failed to load database. Please check if the file is a valid SQLite database.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while loading the database');
        } finally {
            setIsLoading(false);
        }
    }, [onDatabaseLoaded]);

    const handleSelectFile = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const filePath = await window.transactionDB.selectDatabaseFile();
            if (filePath) {
                const success = await window.transactionDB.loadDatabase(filePath);
                if (success) {
                    onDatabaseLoaded();
                } else {
                    throw new Error('Failed to load database. Please check if the file is a valid SQLite database.');
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while loading the database');
        } finally {
            setIsLoading(false);
        }
    }, [onDatabaseLoaded]);

    const handleCreateNew = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const filePath = await window.transactionDB.saveDatabaseFile();
            if (filePath) {
                const success = await window.transactionDB.createDatabase(filePath);
                if (success) {
                    onDatabaseLoaded();
                } else {
                    throw new Error('Failed to create database.');
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while creating the database');
        } finally {
            setIsLoading(false);
        }
    }, [onDatabaseLoaded]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="w-full max-w-2xl space-y-6">
                <div className="text-center space-y-2">
                    <DatabaseIcon className="mx-auto h-16 w-16 text-slate-600 dark:text-slate-400" />
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Load Transaction Database
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                        Select an existing database file or create a new one to get started with managing your transactions.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Drag and Drop Area */}
                    <Card
                        className={`transition-all duration-200 cursor-pointer hover:shadow-lg ${isDragOver
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <CardHeader className="text-center">
                            <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                            <CardTitle className="text-lg">Drag & Drop</CardTitle>
                            <CardDescription>
                                Drag a database file here to load it
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Supports .db, .sqlite, .sqlite3 files
                            </p>
                        </CardContent>
                    </Card>

                    {/* Browse Files */}
                    <Card className="transition-all duration-200 cursor-pointer hover:shadow-lg">
                        <CardHeader className="text-center">
                            <FileIcon className="mx-auto h-12 w-12 text-slate-400" />
                            <CardTitle className="text-lg">Browse Files</CardTitle>
                            <CardDescription>
                                Select a database file from your computer
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <Button
                                onClick={handleSelectFile}
                                disabled={isLoading}
                                variant="outline"
                                className="w-full"
                            >
                                {isLoading ? 'Loading...' : 'Select File'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Create New Database */}
                <Card className="transition-all duration-200">
                    <CardHeader className="text-center">
                        <PlusIcon className="mx-auto h-12 w-12 text-slate-400" />
                        <CardTitle className="text-lg">Create New Database</CardTitle>
                        <CardDescription>
                            Start fresh with a new transaction database
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <Button
                            onClick={handleCreateNew}
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading ? 'Creating...' : 'Create New Database'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
