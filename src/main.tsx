import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'
import './lib/initLogos.ts' // Initialize logos system
import { useDynamicFavicon } from './hooks/useDynamicFavicon'

// Component to handle favicon initialization
function AppWithFavicon() {
  useDynamicFavicon();
  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWithFavicon />
  </StrictMode>
);
