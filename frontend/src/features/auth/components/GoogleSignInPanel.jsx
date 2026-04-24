import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../../../services/httpClient.js';
import { isGoogleOAuthConfigured } from '../../../config/googleClient.js';

/**
 * Google Identity Services (OAuth 2.0) — sign-in or first-time account creation via backend /api/auth/google.
 * Must run under {@link GoogleOAuthProvider} in main.jsx when configured.
 */
export default function GoogleSignInPanel({
  title = 'Continue with Google',
  successMessage = 'Signed in with Google.',
}) {
  const { login } = useAuth();
  const googleClientIdConfigured = isGoogleOAuthConfigured();

  const handleGoogleSuccess = async ({ credential }) => {
    try {
      await login(credential);
      toast.success(successMessage);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Google Sign-In failed. Please try again.');
    }
  };

  if (!googleClientIdConfigured) {
    return (
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900 space-y-2">
        <p className="font-semibold">Enable Google Sign-In locally</p>
        <p className="text-xs text-amber-900/90">
          From the <code className="bg-amber-100 px-1 rounded">frontend</code> folder run{' '}
          <code className="bg-amber-100 px-1 rounded">npm run setup-google</code> to open Google Cloud Credentials and
          ensure <code className="bg-amber-100 px-1 rounded">.env</code> exists.
        </p>
        <ol className="list-decimal list-inside space-y-1 text-amber-900/95">
          <li>
            In Google Cloud, open your OAuth 2.0 <strong>Web</strong> client and add{' '}
            <strong>Authorized JavaScript origins</strong> for your dev URL (e.g.{' '}
            <code className="text-xs bg-amber-100 px-1 rounded">http://localhost:5173</code>,{' '}
            <code className="text-xs bg-amber-100 px-1 rounded">http://127.0.0.1:5173</code>, and{' '}
            <code className="text-xs">5174</code>/<code className="text-xs">5175</code> if needed).
          </li>
          <li>
            Copy the <strong>Client ID</strong> into <code className="text-xs bg-amber-100 px-1 rounded">frontend/.env</code> as{' '}
            <code className="text-xs bg-amber-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID=…apps.googleusercontent.com</code>{' '}
            (one line, no quotes). Optionally set the same value as{' '}
            <code className="text-xs bg-amber-100 px-1 rounded">GOOGLE_OAUTH_WEB_CLIENT_ID</code> in the backend env so
            the API verifies the token audience. Restart <code className="text-xs">npm run dev</code>.
          </li>
          <li>
            Run Spring Boot on port <strong>8080</strong> so Vite can proxy{' '}
            <code className="text-xs bg-amber-100 px-1 rounded">/api</code> there (leave{' '}
            <code className="text-xs bg-amber-100 px-1 rounded">VITE_API_BASE_URL</code> unset unless you bypass the
            proxy).
          </li>
        </ol>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low/30 px-4 py-6">
      <p className="text-center text-xs font-medium text-on-surface-variant">{title}</p>
      <div className="flex min-h-[44px] w-full max-w-[320px] justify-center items-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error('Google Sign-In failed. Please try again.')}
          theme="outline"
          size="large"
          shape="rectangular"
          width="280"
        />
      </div>
    </div>
  );
}
