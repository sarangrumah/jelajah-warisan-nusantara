import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/index.ts'
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log(window.location.href);
createRoot(document.getElementById("root")!).render(<App />);
