import Link from "next/link";

const ActivationPendingPage = () => {
  return (
    <div className="min-h-screen bg-theme-white md:bg-gray-50 flex items-center justify-center p-6 text-gray-900">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-theme-blue/10 border border-gray-100 p-8 md:p-12 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-theme-blue/70">
            Account Status
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-theme-blue">
            Your account is still pending activation
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Your registration has been received. Please wait for your barangay SK officials to activate your account before you can access the dashboard.
          </p>
        </div>

        <div className="rounded-2xl border border-theme-blue/20 bg-theme-blue/5 p-4">
          <p className="text-sm text-theme-blue/90">
            You can try signing in again later. Once your status becomes active, you will be able to continue to your dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-xl bg-theme-blue px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Back to Sign In
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivationPendingPage;
