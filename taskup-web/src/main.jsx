/**
 * main.jsx — Application entry point
 * ─────────────────────────────────────────────────────
 * Imports the global CSS theme and renders the App component.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './theme.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
