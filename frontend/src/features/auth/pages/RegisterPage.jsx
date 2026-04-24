import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../../../services/httpClient.js';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await register({ displayName, email, password });
      toast.success('Account created! Welcome to SmartCampus.');
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full border border-outline-variant rounded-xl px-4 py-3 text-sm bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/30 transition-all';

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
          <h1 className="font-headline font-bold text-2xl text-on-surface mb-1 text-center">Create account</h1>
          <p className="text-on-surface-variant text-sm text-center mb-6">Register to access the campus portal</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="reg-name"
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5"
              >
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputClass}
                placeholder="e.g. John Doe"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5"
              >
                Email
              </label>
              <input
                id="reg-email"
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
              <label
                htmlFor="reg-password"
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5"
              >
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label
                htmlFor="reg-confirm"
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5"
              >
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
                placeholder="Re-enter password"
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !displayName || !email || !password || !confirm}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow hover:opacity-90 transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
