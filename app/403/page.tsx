// app/403/page.tsx
'use client'
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter()
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center text-black px-6">
        {/* Big 404 */}
        <h1 className="text-[120px] md:text-[180px] font-extrabold leading-none drop-shadow-lg text-theme-dark-blue">
          403
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl font-semibold mb-4">
          Forbidden
        </p>

        {/* Description */}
        <p className="text-sm md:text-base opacity-90 mb-8">
          You don’t have access to this area.
        </p>

        {/* Button */}
        <button
          onClick={() => router.back()}
          className="inline-block rounded-full bg-white text-theme-dark-blue px-6 py-3 font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}