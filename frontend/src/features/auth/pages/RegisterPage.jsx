import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { registerSchema } from '../validation/authSchemas.js';
import { getErrorMessage } from '../../../services/httpClient.js';

const inputClass =
  'w-full border border-outline-variant rounded-xl px-4 py-3 text-sm bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/30 transition-all';
const labelClass =
  'block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5';

function fieldClass(hasError) {
  return [inputClass, hasError ? 'border-red-500 ring-2 ring-red-500/15' : ''].filter(Boolean).join(' ');
}

const defaultValues = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterPage() {
  const { user, register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: 'onTouched',
  });

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const onSubmit = handleSubmit(async ({ displayName, email, password }) => {
    try {
      await registerUser({ displayName, email, password });
      toast.success('Account created! Welcome to SmartCampus.');
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Registration failed. Please try again.');
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
          <h1 className="font-headline font-bold text-2xl text-on-surface mb-1 text-center">Create account</h1>
          <p className="text-on-surface-variant text-sm text-center mb-6">Register to access the campus portal</p>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="reg-name" className={labelClass}>
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                placeholder="e.g. John Doe"
                className={fieldClass(Boolean(errors.displayName))}
                aria-invalid={errors.displayName ? 'true' : 'false'}
                aria-describedby={errors.displayName ? 'reg-name-error' : undefined}
                {...register('displayName')}
              />
              {errors.displayName?.message ? (
                <p id="reg-name-error" className="mt-1.5 text-error text-xs font-medium" role="alert">
                  {errors.displayName.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="reg-email" className={labelClass}>
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                placeholder="you@sliit.lk"
                className={fieldClass(Boolean(errors.email))}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'reg-email-error' : undefined}
                {...register('email')}
              />
              {errors.email?.message ? (
                <p id="reg-email-error" className="mt-1.5 text-error text-xs font-medium" role="alert">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="reg-password" className={labelClass}>
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                placeholder="6–100 characters"
                className={fieldClass(Boolean(errors.password))}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={
                  errors.password ? 'reg-password-hint reg-password-error' : 'reg-password-hint'
                }
                {...register('password')}
              />
              <p id="reg-password-hint" className="mt-1 text-on-surface-variant text-xs">
                Use at least 6 characters (matches server rules).
              </p>
              {errors.password?.message ? (
                <p id="reg-password-error" className="mt-1.5 text-error text-xs font-medium" role="alert">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="reg-confirm" className={labelClass}>
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter password"
                className={fieldClass(Boolean(errors.confirmPassword))}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'reg-confirm-error' : undefined}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword?.message ? (
                <p id="reg-confirm-error" className="mt-1.5 text-error text-xs font-medium" role="alert">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account…' : 'Create Account'}
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
