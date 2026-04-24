import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { loginEmailSchema } from '../validation/authSchemas.js';
import { getErrorMessage } from '../../../services/httpClient.js';

const googleClientIdConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim());

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
  const [mode, setMode] = useState(googleClientIdConfigured ? 'google' : 'email');

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
    } catch {
      toast.error('Google Sign-In failed. Please try again.');
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
              Google
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
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
                  Google Sign-In is not configured. Copy{' '}
                  <code className="text-xs bg-amber-100 px-1 rounded">frontend/.env.example</code> to{' '}
                  <code className="text-xs bg-amber-100 px-1 rounded">frontend/.env</code>, set{' '}
                  <code className="text-xs bg-amber-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> to your Web
                  client ID from Google Cloud Console, then restart <code className="text-xs">npm run dev</code>.
                </div>
              ) : (
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google Sign-In failed. Please try again.')}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    width="280"
                  />
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
