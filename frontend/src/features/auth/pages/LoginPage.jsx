import { useEffect, useMemo, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginWithGoogle } from '../api/authApi.js';
import { useAuth } from '../hooks/useAuth.js';
import Icon from '../../../components/common/Icon.jsx';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

function makeSubject(email, displayName) {
  const base = (email || displayName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
  return base || 'user';
}

function getRegisteredAccounts() {
  try {
    const raw = localStorage.getItem('registeredAccounts');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildGoogleToken(email, displayName) {
  const safeEmail = (email || '').trim().toLowerCase();
  const safeName = (displayName || '').trim() || 'Google User';
  const sub = makeSubject(safeEmail, safeName);
  const normalizedEmail = safeEmail || `${sub}@google.local`;
  return `${sub}|${normalizedEmail}|${safeName}|`;
}

function validateForm({ email, password }) {
  /** @type {{email?: string, password?: string}} */
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password.trim()) {
    errors.password = 'Password is required.';
  } else if (password.trim().length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

function getLoginErrorMessage(error) {
  const status = error?.response?.status;
  const apiMessage = error?.response?.data?.message;
  if (typeof apiMessage === 'string' && apiMessage.trim()) return apiMessage;
  if (status === 401) return 'Login failed. Please check your token details.';
  if (status === 403) return 'You are not allowed to access this area.';
  if (status === 404) return 'Auth service not found. Check backend URL/proxy.';
  if (status >= 500) return 'Server error. Please try again in a moment.';
  return error?.message || 'Login failed. Please try again.';
}

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  useEffect(() => {
    const prefilledEmail = location.state?.registeredEmail;
    const prefilledPassword = location.state?.registeredPassword;
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }
    if (prefilledPassword) {
      setPassword(prefilledPassword);
      toast.success('Account created. Sign in to continue.');
    }
  }, [location.state]);

  const handleGoogleCredential = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      setApiError('Google did not return a credential.');
      return;
    }
    setSubmitting(true);
    setApiError('');
    try {
      const user = await loginWithGoogle({ googleToken: idToken });
      const authUser = { ...user, googleToken: idToken };
      login(authUser);
      navigate('/', { replace: true });
    } catch (e) {
      setApiError(getLoginErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignIn = async () => {
    const formErrors = validateForm({ email, password });
    setErrors(formErrors);
    if (Object.keys(formErrors).length) return;

    const account = getRegisteredAccounts().find((item) => item.email === normalizedEmail);
    if (!account) {
      setApiError('Account not found. Please register first.');
      return;
    }
    if (account.password !== password) {
      setApiError('Invalid password.');
      return;
    }

    const finalToken = buildGoogleToken(account.email, account.fullName);
    setSubmitting(true);
    setApiError('');
    try {
      const user = await loginWithGoogle({ googleToken: finalToken });
      const authUser = { ...user, googleToken: finalToken };
      login(authUser);
      navigate('/', { replace: true });
    } catch (e) {
      setApiError(getLoginErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDevGoogleSignIn = async () => {
    const formErrors = validateForm({ email, password: 'temporary-password' });
    setErrors(formErrors);
    if (Object.keys(formErrors).length) return;

    const account = getRegisteredAccounts().find((item) => item.email === normalizedEmail);
    if (!account) {
      setApiError('Please register first, then use dev Google sign-in.');
      return;
    }

    setSubmitting(true);
    setApiError('');
    try {
      const googleToken = buildGoogleToken(account.email, account.fullName);
      const user = await loginWithGoogle({ googleToken });
      const authUser = { ...user, googleToken };
      login(authUser);
      navigate('/', { replace: true });
    } catch (e) {
      setApiError(getLoginErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-6">
      <section className="w-full max-w-md">
        <div className="w-full bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6">
          <h2 className="text-2xl font-bold text-on-surface text-center">Welcome back</h2>
          <p className="text-xs text-on-surface-variant text-center mt-1 mb-6">
            Sign in with Google (OAuth 2.0) or use the local demo account flow
          </p>

          {googleClientId ? (
            <div className="mb-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleCredential}
                onError={() => setApiError('Google sign-in was cancelled or failed.')}
                useOneTap={false}
              />
            </div>
          ) : (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Set <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> in <code className="font-mono">.env</code>{' '}
              to enable the real Google button. Dev token login still works below.
            </div>
          )}

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Icon
                  name="mail"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@university.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant/50 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              {errors.email ? <p className="text-xs text-error mt-1">{errors.email}</p> : null}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-on-surface">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => toast.message('Forgot password flow not connected yet.')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Icon
                  name="lock"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant/50 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              {errors.password ? <p className="text-xs text-error mt-1">{errors.password}</p> : null}
            </div>

            <button
              type="button"
              className="w-full rounded-lg bg-[#111111] text-white font-semibold py-2.5 hover:opacity-95 transition-opacity shadow-sm"
              onClick={handleSignIn}
              disabled={submitting}
            >
              {submitting ? 'Signing in...' : 'Sign in (demo account)'}
            </button>

            <div className="relative py-1">
              <div className="h-px bg-outline-variant/40" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] px-2 bg-white text-on-surface-variant">
                OR DEV GOOGLE TOKEN
              </span>
            </div>

            <button
              type="button"
              className="w-full rounded-full bg-[#3f8ae6] text-white font-semibold py-2.5 hover:opacity-95 transition-opacity shadow-sm flex items-center justify-center gap-2"
              onClick={handleDevGoogleSignIn}
              disabled={submitting}
            >
              <span className="w-5 h-5 rounded-full bg-white text-[#3f8ae6] text-xs font-bold flex items-center justify-center">
                G
              </span>
              Dev: pipe-format Google token
            </button>

            {apiError ? (
              <div className="rounded-lg border border-error/30 bg-error-container/40 px-3 py-2 text-xs text-on-error-container">
                {apiError}
              </div>
            ) : null}

            <p className="text-xs text-on-surface-variant text-center pt-2">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="text-primary font-semibold hover:underline"
                onClick={() => navigate('/register')}
              >
                Create one now
              </button>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
