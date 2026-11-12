import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AppRouter } from './app/router'

async function enableMocking() {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./mocks/browser')
      await worker.start({ onUnhandledRequest: 'bypass' })
    } catch (error) {
      console.warn('Mock API worker could not start; using the backend API.', error)
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
)

void enableMocking()
