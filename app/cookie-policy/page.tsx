import Link from "next/link";

export const metadata = {
	title: "Cookie Policy",
};

export default function CookiePolicyPage() {
	return (
		<main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
			<div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
				<p className="mb-3 text-xs font-mono uppercase tracking-[0.2em] text-theme-dark-blue">
					Last updated - April 19, 2026
				</p>
				<h1 className="mb-4 text-3xl font-black text-slate-900 sm:text-4xl">
					Cookie Policy
				</h1>
				<p className="mb-4 text-sm leading-7 text-slate-600 sm:text-base">
					Kabataan Statistical Profile uses cookies and similar storage technologies
					to keep the platform secure, remember session preferences, and understand
					how public pages are used.
				</p>
				<div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
					<p>
						Essential cookies may be used to support authentication flows, protect
						against abuse, and maintain core site functionality. Where analytics or
						preference cookies are introduced, this page should be updated to
						describe the specific categories, purpose, and retention period.
					</p>
					<p>
						You can usually manage cookies through your browser settings. Disabling
						some cookies may affect the availability or reliability of parts of the
						service.
					</p>
					<p>
						For broader information about how personal data is handled, see the
						privacy notice.
					</p>
				</div>
				<div className="mt-8 flex flex-wrap gap-3">
					<Link
						href="/privacy-policy"
						className="inline-flex rounded-full bg-theme-dark-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
					>
						View Privacy Policy
					</Link>
					<Link
						href="/"
						className="inline-flex rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
					>
						Back to Home
					</Link>
				</div>
			</div>
		</main>
	);
}
