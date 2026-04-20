import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './features/auth/context/AuthContext.jsx';
import { router } from './routes/router.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" closeButton />
      </>
    </AuthProvider>
  </StrictMode>
);
