import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import AppRoutes from './config/AppRoutes.jsx'
import { Toaster } from 'react-hot-toast'
import { ChatProvider } from './context/chatContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <Toaster position='top-right' />
      <ChatProvider>
        <AppRoutes />
      </ChatProvider>
    </BrowserRouter>
  // </StrictMode>
)
