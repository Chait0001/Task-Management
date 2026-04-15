import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--glass-bg)',
            color: 'var(--text-primary)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--glass-border-subtle)',
            boxShadow: 'var(--shadow-glass)',
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>,
)
