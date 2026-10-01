import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import AdminApp from './admin/index';
import './index.css';
import { queryClient } from './lib/react-query/queryClient';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element with id "root" was not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          {/* Admin CMS — no links from public site, only accessible via /admin URL */}
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
