import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { syncThemeWithLocal } from './helpers/theme_helpers';
import { useTranslation } from 'react-i18next';
import './localization/i18n';
import { updateAppLanguage } from './helpers/language_helpers';
import AppRouter from './routes/routes';  // Importing the router

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    syncThemeWithLocal();
    updateAppLanguage(i18n);
  }, [i18n]);  // Ensure i18n is included in the dependency array

  return <AppRouter />;  // Use AppRouter to manage routes
}

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
