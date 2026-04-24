import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { loginEmailSchema } from '../validation/authSchemas.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import { isGoogleOAuthConfigured } from '../../../config/googleClient.js';

const inputClass =
  'w-full border border-outline-variant rounded-xl px-4 py-3 text-sm bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/30 transition-all';
const labelClass =
  'block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5';

function fieldClass(hasError) {
  return [inputClass, hasError ? 'border-red-500 ring-2 ring-red-500/15' : ''].filter(Boolean).join(' ');
}

export default function LoginPage() {
  const { user, login, loginWithCredentials } = useAuth();
  const navigate = useNavigate();
  const googleClientIdConfigured = isGoogleOAuthConfigured();
  // Always start on Google tab so OAuth 2.0 sign-in (or setup steps) is visible first
  const [mode, setMode] = useState('google');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginEmailSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleGoogleSuccess = async ({ credential }) => {
    try {
      await login(credential);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Google Sign-In failed. Please try again.');
    }
  };

  const onEmailLogin = handleSubmit(async ({ email, password }) => {
    try {
      await loginWithCredentials({ email, password });
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Invalid email or password.');
    }
  });

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">school</span>
            </div>
            <span className="font-headline font-bold text-2xl text-on-surface">SmartCampus</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-8">
          <h1 className="font-headline font-bold text-2xl text-on-surface mb-1 text-center">Welcome back</h1>
          <p className="text-on-surface-variant text-sm text-center mb-6">Sign in to manage campus resources</p>

          <p className="text-center text-xs text-on-surface-variant mb-4">
            Google Sign-In uses <span className="font-semibold text-on-surface">OAuth 2.0</span> (Google Identity
            Services), or use email and password.
          </p>

          <div className="flex rounded-xl bg-surface-container-low p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode('google')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'google'
                  ? 'bg-white shadow-sm text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Google (OAuth 2.0)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('email');
                reset();
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'email'
                  ? 'bg-white shadow-sm text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Email
            </button>
          </div>

          {mode === 'google' ? (
            <div className="space-y-3">
              {!googleClientIdConfigured ? (
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900 space-y-2">
                  <p className="font-semibold">Enable Google Sign-In locally</p>
                  <ol className="list-decimal list-inside space-y-1 text-amber-900/95">
                    <li>
                      Copy{' '}
                      <code className="text-xs bg-amber-100 px-1 rounded">frontend/.env.example</code> to{' '}
                      <code className="text-xs bg-amber-100 px-1 rounded">frontend/.env</code>.
                    </li>
                    <li>
                      Set <code className="text-xs bg-amber-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> to your
                      OAuth 2.0 <strong>Web client</strong> ID (ends in{' '}
                      <code className="text-xs bg-amber-100 px-1 rounded">.apps.googleusercontent.com</code>).
                    </li>
                    <li>
                      In Google Cloud Console → Credentials → that client → <strong>Authorized JavaScript origins</strong>
                      , add the exact Vite URL you use (e.g.{' '}
                      <code className="text-xs bg-amber-100 px-1 rounded">http://localhost:5173</code>
                      — add <code className="text-xs">5174</code>/<code className="text-xs">5175</code> if needed).
                    </li>
                    <li>
                      Run the Spring Boot backend on port <strong>8080</strong> (Vite proxies{' '}
                      <code className="text-xs bg-amber-100 px-1 rounded">/api</code> there). Only set{' '}
                      <code className="text-xs bg-amber-100 px-1 rounded">VITE_API_BASE_URL</code> if you are not
                      using that proxy. Restart <code className="text-xs">npm run dev</code> after changing{' '}
                      <code className="text-xs">.env</code>.
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low/30 px-4 py-6">
                  <p className="text-center text-xs font-medium text-on-surface-variant">Continue with Google</p>
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
              )}
            </div>
          ) : (
            <form onSubmit={onEmailLogin} className="space-y-4" noValidate>
              <div>
                <label htmlFor="login-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@sliit.lk"
                  className={fieldClass(Boolean(errors.email))}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                  {...register('email')}
                />
                {errors.email?.message ? (
                  <p id="login-email-error" className="mt-1.5 text-error text-xs font-medium" role="alert">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="login-password" className={labelClass}>
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={fieldClass(Boolean(errors.password))}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                  {...register('password')}
                />
                {errors.password?.message ? (
                  <p id="login-password-error" className="mt-1.5 text-error text-xs font-medium" role="alert">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-on-surface-variant">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
