import Link from "next/link";
import { Film } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Film size={28} className="text-accent" />
        </div>
        <h1 className="text-6xl font-black mb-2 neon-text text-accent">404</h1>
        <p className="text-xl font-semibold mb-2">Scene not found</p>
        <p className="text-muted text-sm mb-8">
          The movie you&apos;re looking for doesn&apos;t exist or was removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl neon-glow transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
