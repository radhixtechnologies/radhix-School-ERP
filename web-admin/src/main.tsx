import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initOfflineMockEngine } from './services/apiMockInterceptor.ts'

// Initialize fallback engine for Netlify and static hosting
initOfflineMockEngine();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

