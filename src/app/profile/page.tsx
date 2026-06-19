import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { User, Heart, Clock, LogOut, Shield } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [favCount, historyCount, recentHistory] = await Promise.all([
    prisma.favorite.count({ where: { userId: session.user.id } }),
    prisma.watchHistory.count({ where: { userId: session.user.id } }),
    prisma.watchHistory.findMany({
      where: { userId: session.user.id },
      include: { movie: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="glass rounded-card p-8 mb-8 flex items-center gap-6">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-3xl font-bold neon-glow flex-shrink-0">
            {session.user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{session.user.name}</h1>
            <p className="text-muted text-sm">{session.user.email}</p>
            {session.user.role === "ADMIN" && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                <Shield size={12} /> Admin
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link href="/favorites" className="glass rounded-card p-6 hover:bg-surface-2 transition-colors">
            <Heart size={20} className="text-accent mb-2" />
            <p className="text-2xl font-bold">{favCount}</p>
            <p className="text-muted text-sm">Favorites</p>
          </Link>
          <div className="glass rounded-card p-6">
            <Clock size={20} className="text-blue-400 mb-2" />
            <p className="text-2xl font-bold">{historyCount}</p>
            <p className="text-muted text-sm">Watched</p>
          </div>
        </div>

        {/* Recent activity */}
        {recentHistory.length > 0 && (
          <div className="glass rounded-card p-6 mb-8">
            <h2 className="font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentHistory.map((h) => (
                <Link
                  key={h.id}
                  href={`/movies/${h.movieId}`}
                  className="flex items-center gap-3 hover:bg-surface-2 p-2 rounded-xl transition-colors -mx-2"
                >
                  <div className="w-8 h-12 bg-surface rounded-lg overflow-hidden flex-shrink-0">
                    {h.movie.posterUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={h.movie.posterUrl} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{h.movie.title}</p>
                    <div className="h-1 bg-white/10 rounded-full mt-1 overflow-hidden w-32">
                      <div className="h-full bg-accent" style={{ width: `${h.progress}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-muted">{Math.round(h.progress)}%</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sign out */}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-3 glass rounded-xl text-red-400 hover:bg-red-400/10 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
