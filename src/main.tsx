import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/index-dynamic.ts'
import { LoadingProvider } from './components/LoadingContext';
import { UnifiedTranslationProvider } from './contexts/UnifiedTranslationContext';
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById("root")!).render(
  <UnifiedTranslationProvider>
    <LoadingProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </LoadingProvider>
  </UnifiedTranslationProvider>
);
