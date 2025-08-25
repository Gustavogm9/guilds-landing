import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/initLogos.ts' // Initialize logos system

createRoot(document.getElementById("root")!).render(<App />);
