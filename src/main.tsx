import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/index-dynamic.ts'
import { LoadingProvider } from './components/LoadingContext';
import { TranslationProvider } from './contexts/TranslationContext';

createRoot(document.getElementById("root")!).render(
  <TranslationProvider>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </TranslationProvider>
);
