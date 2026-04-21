import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Icon from '../../../components/common/Icon.jsx';

function validateRegisterForm({ fullName, email, password, confirmPassword }) {
  /** @type {{fullName?: string, email?: string, password?: string, confirmPassword?: string}} */
  const errors = {};

  if (!fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password.trim()) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (!confirmPassword.trim()) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleRegister = () => {
    const formErrors = validateRegisterForm({ fullName, email, password, confirmPassword });
    setErrors(formErrors);
    if (Object.keys(formErrors).length) return;

    const normalizedEmail = email.trim().toLowerCase();
    const raw = localStorage.getItem('registeredAccounts');
    const accounts = raw ? JSON.parse(raw) : [];
    const alreadyExists = accounts.some((item) => item.email === normalizedEmail);
    if (alreadyExists) {
      setErrors({ email: 'This email is already registered. Please sign in.' });
      return;
    }

    const nextAccounts = [
      ...accounts,
      {
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
      },
    ];
    localStorage.setItem('registeredAccounts', JSON.stringify(nextAccounts));

    toast.success('Registration details saved. Please sign in.');
    navigate('/login', {
      state: {
        registeredEmail: normalizedEmail,
        registeredPassword: password,
      },
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-outline-variant/30 shadow-sm p-6">
        <h2 className="text-2xl font-bold text-on-surface text-center">Create account</h2>
        <p className="text-xs text-on-surface-variant text-center mt-1 mb-6">
          Fill the form and continue to sign in.
        </p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-on-surface mb-1.5">
              Full name
            </label>
            <div className="relative">
              <Icon
                name="person"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]"
              />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-lg border border-outline-variant/50 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            {errors.fullName ? <p className="text-xs text-error mt-1">{errors.fullName}</p> : null}
          </div>

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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.com"
                className="w-full rounded-lg border border-outline-variant/50 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            {errors.email ? <p className="text-xs text-error mt-1">{errors.email}</p> : null}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-on-surface mb-1.5">
              Password
            </label>
            <div className="relative">
              <Icon
                name="lock"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]"
              />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-lg border border-outline-variant/50 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            {errors.password ? <p className="text-xs text-error mt-1">{errors.password}</p> : null}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-on-surface mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <Icon
                name="lock_reset"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]"
              />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-lg border border-outline-variant/50 pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            {errors.confirmPassword ? (
              <p className="text-xs text-error mt-1">{errors.confirmPassword}</p>
            ) : null}
          </div>

          <button
            type="button"
            className="w-full rounded-lg bg-[#3525cd] text-white font-semibold py-2.5 hover:opacity-95 transition-opacity"
            onClick={handleRegister}
          >
            Create account
          </button>

          <p className="text-xs text-on-surface-variant text-center">
            Already have an account?{' '}
            <button
              type="button"
              className="text-primary font-semibold hover:underline"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
