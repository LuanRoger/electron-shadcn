# Database File Loading

This application now supports loading SQLite database files from the filesystem instead of automatically creating a default database.

## Features

### Database Selection Page
When no database is loaded, the application displays a dedicated database selection page with three options:

1. **Drag & Drop**: Drag a `.db`, `.sqlite`, or `.sqlite3` file directly into the application
2. **Browse Files**: Use the file browser to select a database file
3. **Create New**: Create a new database file at a specified location

### Database Management
- **Database Indicator**: Shows the currently loaded database file name in the navigation bar
- **Switch Database**: Click the "X" button next to the database name to close the current database and return to the selection page
- **Auto-validation**: The application validates that selected files are valid SQLite databases

### File Support
The application supports the following file extensions:
- `.db`
- `.sqlite`
- `.sqlite3`

## Usage

### Loading an Existing Database
1. Start the application
2. On the database selection page:
   - **Option A**: Drag your database file into the drag & drop area
   - **Option B**: Click "Select File" and browse for your database file
3. The application will validate and load the database
4. You'll be taken to the main application interface

### Creating a New Database
1. Start the application
2. Click "Create New Database" on the selection page
3. Choose where to save the new database file
4. The application will create and initialize a new database
5. You'll be taken to the main application interface

### Switching Databases
1. In the main application, look for the database indicator in the top navigation
2. Click the "X" button next to the database name
3. You'll return to the database selection page
4. Follow the steps above to load a different database

## Technical Implementation

### Database Class Changes
The `TransactionDB` class has been updated with new methods:
- `loadDatabase(filePath: string)`: Load an existing database file
- `createDatabase(filePath: string)`: Create a new database file
- `closeDatabase()`: Close the current database
- `isLoaded`: Property to check if a database is loaded
- `currentDbPath`: Property to get the current database file path

### IPC Channels
New IPC channels have been added for database file operations:
- `database:load`: Load a database file
- `database:create`: Create a new database file
- `database:close`: Close the current database
- `database:is-loaded`: Check if database is loaded
- `database:get-path`: Get current database path
- `database:select-file`: Open file browser dialog
- `database:save-file`: Open save file dialog

### Error Handling
The application includes comprehensive error handling:
- File validation (checks for valid SQLite files)
- Database connection errors
- File permission errors
- User-friendly error messages

## Components

### DatabaseSelectionPage
The main page shown when no database is loaded, featuring:
- Drag and drop functionality
- File browser integration
- New database creation
- Loading states and error handling

### DatabaseIndicator
A component in the navigation bar that:
- Shows the currently loaded database name
- Allows closing the current database
- Displays full path on hover

### useDatabaseLoader Hook
A React hook that manages database loading state:
- Tracks loading status
- Handles database operations
- Provides error state management

## Migration from Previous Version

If you were using a previous version that automatically created a default database:
1. Your existing `transactions.db` file should still be in your project directory
2. When you start the updated application, simply load this existing file
3. All your data will be preserved and accessible

## Development

### Running Tests
```bash
npm test src/tests/unit/DatabaseLoading.test.ts
```

### Building
```bash
npm start
```

The application will build and start with the new database loading functionality enabled.
