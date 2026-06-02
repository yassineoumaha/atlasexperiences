import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-amber-500 mb-4">404</div>
        <h1 className="text-2xl font-black text-stone-900 mb-3">Page Not Found</h1>
        <p className="text-stone-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/en"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          Back to Imourig
        </Link>
      </div>
    </div>
  );
}
