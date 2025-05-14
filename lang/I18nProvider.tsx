'use client';

import { useEffect, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

interface I18nClientProviderProps {
  children: ReactNode;
}

// This component wraps anything that needs i18n functionality
export default function I18nClientProvider({ children }: I18nClientProviderProps) {
  useEffect(() => {
    // Initialize language from localStorage on client
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, []);
  
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
