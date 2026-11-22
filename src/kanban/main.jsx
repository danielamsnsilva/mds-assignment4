import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../shared/styles/design-system.css';
import './styles/flowlab.css';
import { App } from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
