```markdown
# Project Code Guidelines

## 1. Project Overview

This document outlines the coding standards and best practices for the PUBG Competitive Platform desktop application. This application is built using Electron, TypeScript, React, Tailwind CSS, Shadcn UI, and Supabase. The primary goal is to ensure code consistency, maintainability, and scalability across the project. The architecture follows a domain-driven, layered approach, separating concerns into presentation, business logic, data access, and infrastructure layers.

## 2. Core Principles

*   **Maintainability:** Write code that is easy to understand, modify, and extend by others.
*   **Readability:** Prioritize clear and concise code that is well-documented.
*   **Testability:** Design code that is easily testable with unit and integration tests.
*   **Performance:** Optimize code for speed and efficiency without sacrificing readability.
*   **Security:** Implement security best practices to protect user data and prevent vulnerabilities.

## 3. Language-Specific Guidelines

### 3.1 TypeScript

#### File Organization and Directory Structure

*   Follow the universal file and folder structure outlined in the TRD.
*   Group related files within domain-specific directories.
*   Use descriptive and consistent file names.

    ```
    src/
    ├── components/
    │   ├── common/
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   └── ...
    │   ├── game/
    │   │   ├── GameCard.tsx
    │   │   └── ...
    ├── services/
    │   ├── pubgApi.ts
    │   ├── supabase.ts
    │   └── ...
    ├── types/
    │   ├── game.ts
    │   ├── user.ts
    │   └── ...
    ```

#### Import/Dependency Management

*   Use absolute imports for internal modules to improve readability and prevent issues with relative paths.
*   Group imports by source (e.g., external libraries, internal modules).
*   Avoid circular dependencies.
*   Declare all dependencies in `package.json`.

    ```typescript
    // MUST: Absolute imports
    import { Button } from '@/components/common/Button';

    // MUST NOT: Relative imports (avoid these)
    // import { Button } from '../../components/common/Button';
    ```

#### Error Handling Patterns

*   Use `try...catch` blocks for handling synchronous errors.
*   Use `async/await` with `try...catch` for handling asynchronous errors.
*   Create custom error classes for specific error scenarios.
*   Log errors with sufficient context for debugging.

    ```typescript
    // MUST: Asynchronous error handling
    async function fetchData() {
      try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
        throw error; // Re-throw or handle as appropriate
      }
    }
    ```

### 3.2 React

#### Component Structure

*   Use functional components with hooks for state management and side effects.
*   Keep components small and focused on a single responsibility.
*   Use prop types to define the expected props for each component.
*   Separate UI logic from data fetching and processing logic.

    ```typescript
    // MUST: Functional component with hooks
    import React, { useState } from 'react';

    interface MyComponentProps {
      name: string;
    }

    const MyComponent: React.FC<MyComponentProps> = ({ name }) => {
      const [count, setCount] = useState(0);

      return (
        <div>
          <p>Hello, {name}!</p>
          <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
      );
    };

    export default MyComponent;
    ```

#### State Management

*   Use React Context for global state management.
*   Consider using a state management library like Zustand or Jotai for complex state requirements.
*   Avoid unnecessary re-renders by using `React.memo` or `useMemo`.

    ```typescript
    // MUST: Using React Context
    import React, { createContext, useContext, useState } from 'react';

    interface AuthContextType {
      user: any | null;
      login: (userData: any) => void;
      logout: () => void;
    }

    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      const [user, setUser] = useState<any | null>(null);

      const login = (userData: any) => {
        setUser(userData);
      };

      const logout = () => {
        setUser(null);
      };

      const value: AuthContextType = {
        user,
        login,
        logout,
      };

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };
    ```

#### Data Fetching

*   Use `useEffect` hook for data fetching in functional components.
*   Create custom hooks for reusable data fetching logic.
*   Handle loading and error states appropriately.

    ```typescript
    // MUST: Custom hook for data fetching
    import { useState, useEffect } from 'react';

    function useData<T>(url: string): { data: T | null; loading: boolean; error: Error | null } {
      const [data, setData] = useState<T | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<Error | null>(null);

      useEffect(() => {
        async function fetchData() {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result: T = await response.json();
            setData(result);
          } catch (e: any) {
            setError(e);
          } finally {
            setLoading(false);
          }
        }

        fetchData();
      }, [url]);

      return { data, loading, error };
    }

    export default useData;
    ```

### 3.3 Electron

#### Main Process

*   Keep the main process lean and focused on window management and inter-process communication.
*   Delegate complex logic to renderer processes or background services.
*   Handle application lifecycle events (e.g., `ready`, `window-all-closed`) appropriately.

#### Renderer Process

*   Follow React best practices for UI development.
*   Use `ipcRenderer` for communication with the main process.
*   Isolate sensitive logic from the renderer process.

#### Inter-Process Communication (IPC)

*   Use `ipcRenderer.invoke` for synchronous communication and `ipcRenderer.send` for asynchronous communication.
*   Define clear message channels and data structures for IPC.
*   Handle errors and exceptions in both the main and renderer processes.

    ```typescript
    // MUST: IPC Communication (Main Process)
    import { ipcMain } from 'electron';

    ipcMain.handle('get-app-version', async () => {
      return app.getVersion();
    });

    // MUST: IPC Communication (Renderer Process)
    import { ipcRenderer } from 'electron';

    async function getAppVersion() {
      const version = await ipcRenderer.invoke('get-app-version');
      console.log(version);
    }
    ```

### 3.4 Supabase

#### Database Interactions

*   Use the Supabase client library for database interactions.
*   Follow best practices for SQL queries to optimize performance.
*   Use row-level security (RLS) to control data access.

#### Authentication

*   Use Supabase Auth for user authentication and authorization.
*   Implement proper session management and token handling.
*   Protect sensitive data with encryption.

#### Realtime

*   Use Supabase Realtime for real-time data updates.
*   Handle events and updates efficiently.
*   Implement proper error handling and reconnection logic.

    ```typescript
    // MUST: Supabase Realtime example
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'YOUR_SUPABASE_URL';
    const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
    const supabase = createClient(supabaseUrl, supabaseKey);

    supabase
      .channel('any_name')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'your_table' },
        (payload) => {
          console.log('Change received!', payload);
        }
      )
      .subscribe();
    ```

## 4. Code Style Rules

### MUST Follow:

*   **Naming Conventions:**
    *   Variables: `camelCase`
    *   Functions: `camelCase`
    *   Classes: `PascalCase`
    *   Interfaces: `PascalCase` (prefix with `I` if necessary to avoid naming conflicts)
    *   Constants: `UPPER_SNAKE_CASE`
    *   Components: `PascalCase`
    *   Files: `camelCase.ts` or `PascalCase.tsx`
    *   Rationale: Consistent naming improves code readability and maintainability.
*   **Indentation:** Use 2 spaces for indentation.
    *   Rationale: Consistent indentation makes code easier to read and understand.
*   **Line Length:** Limit lines to 120 characters.
    *   Rationale: Shorter lines improve readability and prevent horizontal scrolling.
*   **Comments:** Write clear and concise comments to explain complex logic.
    *   Rationale: Comments help developers understand the purpose and functionality of code.
*   **Error Handling:** Implement proper error handling to prevent application crashes.
    *   Rationale: Robust error handling improves application stability and user experience.
*   **Code Formatting:** Use Prettier to automatically format code.
    *   Rationale: Consistent formatting reduces code review time and improves code quality.
*   **Type Annotations:** Use explicit type annotations for all variables, function parameters, and return types.
    *   Rationale: TypeScript's type system helps catch errors early and improves code maintainability.
*   **Avoid `any` Type:** Minimize the use of the `any` type. Use more specific types whenever possible.
    *   Rationale: Using specific types improves type safety and reduces the risk of runtime errors.
*   **Use ESLint:** Configure and use ESLint to enforce coding standards and identify potential issues.
    *   Rationale: ESLint helps maintain code quality and consistency across the project.
*   **Use Strict Mode:** Enable TypeScript's strict mode to catch potential errors and enforce best practices.
    *   Rationale: Strict mode improves code safety and reduces the risk of runtime errors.
*   **Use Async/Await:** Prefer `async/await` over callbacks for asynchronous operations.
    *   Rationale: `async/await` makes asynchronous code easier to read and understand.
*   **Immutable Data:** Use immutable data structures whenever possible.
    *   Rationale: Immutable data structures prevent accidental modifications and simplify state management.
*   **Destructuring:** Use destructuring to extract values from objects and arrays.
    *   Rationale: Destructuring makes code more concise and readable.

    ```typescript
    // MUST: Destructuring example
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
    };

    const { firstName, lastName } = user;
    console.log(firstName, lastName); // John Doe
    ```

*   **Spread Operator:** Use the spread operator to create shallow copies of objects and arrays.
    *   Rationale: The spread operator makes it easy to create new objects and arrays without modifying the original data.

    ```typescript
    // MUST: Spread operator example
    const originalArray = [1, 2, 3];
    const newArray = [...originalArray, 4, 5];
    console.log(newArray); // [1, 2, 3, 4, 5]
    ```

### MUST NOT Do:

*   **Global Variables:** MUST NOT use global variables.
    *   Rationale: Global variables can lead to naming conflicts and make code harder to reason about.
*   **Magic Numbers:** MUST NOT use magic numbers (unexplained numeric literals).
    *   Rationale: Magic numbers make code harder to understand and maintain. Use constants instead.

    ```typescript
    // MUST NOT: Magic number
    function calculateArea(radius: number) {
      return 3.14 * radius * radius; // What is 3.14?
    }

    // MUST: Use constant
    const PI = 3.14;
    function calculateArea(radius: number) {
      return PI * radius * radius;
    }
    ```

*   **Nested Callbacks:** MUST NOT use deeply nested callbacks (callback hell).
    *   Rationale: Nested callbacks make code harder to read and maintain. Use `async/await` or Promises instead.
*   **Ignoring Errors:** MUST NOT ignore errors without handling them.
    *   Rationale: Ignoring errors can lead to unexpected behavior and make it harder to debug issues.
*   **Console Logs in Production:** MUST NOT leave `console.log` statements in production code.
    *   Rationale: `console.log` statements can expose sensitive information and impact performance.
*   **Complex Conditional Statements:** MUST NOT write overly complex conditional statements.
    *   Rationale: Complex conditionals make code harder to read and understand. Simplify them using helper functions or switch statements.
*   **Direct DOM Manipulation:** MUST NOT directly manipulate the DOM in React components (except when absolutely necessary).
    *   Rationale: Direct DOM manipulation can interfere with React's virtual DOM and lead to unexpected behavior. Use React's state management and rendering mechanisms instead.
*   **Mutating Props:** MUST NOT mutate props passed to React components.
    *   Rationale: Mutating props can lead to unexpected behavior and make it harder to reason about component updates.
*   **Huge components:** MUST NOT write huge, multi responsibility modules in single file.
    *   Rationale: Huge components are harder to understand, test, and maintain. Break them down into smaller, more focused components.
*   **Complex state management:** MUST NOT define complex state management pattern when simple state management can resolve the case.
    *   Rationale: Overly complex state management can add unnecessary overhead and make code harder to understand. Choose the simplest state management solution that meets the requirements.

## 5. Architecture Patterns

### Component/Module Structure Guidelines

*   **Atomic Design:** Consider using atomic design principles to structure React components (atoms, molecules, organisms, templates, pages).
*   **Separation of Concerns:** Separate UI components from business logic and data fetching.
*   **Single Responsibility Principle:** Each component or module should have a single, well-defined responsibility.

### Data Flow Patterns

*   **Unidirectional Data Flow:** Follow a unidirectional data flow pattern in React applications.
*   **Props for Data Down, Events for Actions Up:** Pass data down to child components via props and use events to communicate actions back to parent components.
*   **Avoid Two-Way Data Binding:** Avoid two-way data binding, as it can make it harder to reason about data flow.

### State Management Conventions

*   **Local State:** Use `useState` hook for component-local state.
*   **Context API:** Use React Context for global state that is needed by multiple components.
*   **Redux/Zustand (Optional):** Consider using Redux or Zustand for more complex state management scenarios.

### API Design Standards

*   **RESTful APIs:** Design APIs following RESTful principles.
*   **JSON Data Format:** Use JSON for request and response bodies.
*   **HTTP Status Codes:** Use appropriate HTTP status codes to indicate success or failure.
*   **Error Handling:** Provide informative error messages in API responses.
*   **Authentication:** Implement proper authentication and authorization mechanisms.
```