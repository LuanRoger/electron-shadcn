import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { DatabaseIcon, FolderOpenIcon, XIcon } from 'lucide-react';
import { useDatabaseLoader } from '../hooks/useDatabaseLoader';

export function DatabaseIndicator() {
    const { isLoaded, currentPath, closeDatabase } = useDatabaseLoader();
    const [showFullPath, setShowFullPath] = useState(false);

    if (!isLoaded || !currentPath) {
        return null;
    }

    const fileName = currentPath.split('/').pop() || currentPath;
    const displayPath = showFullPath ? currentPath : fileName;

    const handleCloseDatabase = async () => {
        const success = await closeDatabase();
        if (success) {
            // App will automatically show database selection page
            window.location.reload();
        }
    };

    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">
            <DatabaseIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span
                className="cursor-pointer hover:underline max-w-48 truncate"
                onClick={() => setShowFullPath(!showFullPath)}
                title={currentPath}
            >
                {displayPath}
            </span>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseDatabase}
                className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                title="Close database"
            >
                <XIcon className="h-3 w-3" />
            </Button>
        </div>
    );
}
