import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { user, login, loginWithCredentials } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('google'); // 'google' | 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      await loginWithCredentials({ email, password });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid email or password.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full border border-outline-variant rounded-xl px-4 py-3 text-sm bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/30 transition-all';

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">school</span>
            </div>
            <span className="font-headline font-bold text-2xl text-on-surface">SmartCampus</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-8">
          <h1 className="font-headline font-bold text-2xl text-on-surface mb-1 text-center">
            Welcome back
          </h1>
          <p className="text-on-surface-variant text-sm text-center mb-6">
            Sign in to manage campus resources
          </p>

          {/* Mode toggle */}
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
              onClick={() => setMode('email')}
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
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4" noValidate>
              <div>
                <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@sliit.lk"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !email || !password}
                className="w-full py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow hover:opacity-90 transition-all disabled:opacity-50"
              >
                {submitting ? 'Signing in…' : 'Sign In'}
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
