export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-outline-variant/30 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-on-surface">Sign in</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Temporary login form for simulated Google sign-in.
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-lg border border-outline-variant/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-on-surface mb-1.5">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your display name"
              className="w-full rounded-lg border border-outline-variant/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="token" className="block text-sm font-medium text-on-surface mb-1.5">
              Token (simulate Google)
            </label>
            <input
              id="token"
              name="token"
              type="text"
              placeholder="sub|email|displayName|profileImageUrl"
              className="w-full rounded-lg border border-outline-variant/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-lg bg-primary text-white font-semibold py-2.5 hover:opacity-95 transition-opacity"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
