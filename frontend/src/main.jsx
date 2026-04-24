import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';
import { AuthProvider } from './features/auth/contexts/AuthContext.jsx';
import { router } from './routes/router.jsx';
import { getGoogleWebClientId, isGoogleOAuthConfigured } from './config/googleClient.js';
import './index.css';

const googleClientId = isGoogleOAuthConfigured() ? getGoogleWebClientId() : '';

const appTree = (
  <AuthProvider>
    <RouterProvider router={router} />
    <Toaster richColors position="top-right" closeButton />
  </AuthProvider>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {googleClientId ? (
      <GoogleOAuthProvider clientId={googleClientId}>{appTree}</GoogleOAuthProvider>
    ) : (
      appTree
    )}
  </StrictMode>
);
