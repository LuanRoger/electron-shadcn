import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { syncThemeWithLocal } from "./helpers/theme_helpers";
import { useTranslation } from "react-i18next";
import "./localization/i18n";
import { updateAppLanguage } from "./helpers/language_helpers";
import { router } from "./routes/router";
import { RouterProvider } from "@tanstack/react-router";
import { DatabaseSelectionPage } from "./pages/DatabaseSelectionPage";
import { useDatabaseLoader } from "./hooks/useDatabaseLoader";

function MainApp() {
  const { i18n } = useTranslation();
  const { isLoaded, isLoading, checkDatabaseStatus } = useDatabaseLoader();

  useEffect(() => {
    syncThemeWithLocal();
    updateAppLanguage(i18n);
  }, [i18n]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-100 mx-auto"></div>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return <DatabaseSelectionPage onDatabaseLoaded={checkDatabaseStatus} />;
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return <MainApp />;
}

const root = createRoot(document.getElementById("app")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
