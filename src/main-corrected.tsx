import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App-corrected.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
