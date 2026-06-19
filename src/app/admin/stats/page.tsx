import { prisma } from "@/lib/prisma";
import { TrendingUp, Eye, Heart, Film, Users } from "lucide-react";

export default async function AdminStatsPage() {
  const [
    moviesByGenre,
    viewsOverTime,
    topFavorited,
    totalViews,
    recentUsers,
  ] = await Promise.all([
    prisma.genre.findMany({
      include: { _count: { select: { movies: true } } },
      orderBy: { movies: { _count: "desc" } },
      take: 10,
    }),
    prisma.movie.findMany({
      select: { title: true, views: true, createdAt: true },
      orderBy: { views: "desc" },
      take: 10,
    }),
    prisma.movie.findMany({
      include: { _count: { select: { favorites: true } } },
      orderBy: { favorites: { _count: "desc" } },
      take: 10,
    }),
    prisma.movie.aggregate({ _sum: { views: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { name: true, email: true, createdAt: true, role: true },
    }),
  ]);

  const maxGenreCount = Math.max(...moviesByGenre.map((g) => g._count.movies), 1);
  const maxFavCount = Math.max(...topFavorited.map((m) => m._count.favorites), 1);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Statistics</h1>
      <p className="text-muted text-sm mb-8">Platform analytics and insights</p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Genre distribution */}
        <div className="glass rounded-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Film size={16} className="text-accent" />
            Movies by Genre
          </h2>
          <div className="space-y-3">
            {moviesByGenre.map((g) => (
              <div key={g.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">{g.name}</span>
                  <span className="text-muted">{g._count.movies}</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${(g._count.movies / maxGenreCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most favorited */}
        <div className="glass rounded-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Heart size={16} className="text-accent" />
            Most Favorited
          </h2>
          <div className="space-y-3">
            {topFavorited.map((m) => (
              <div key={m.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 truncate max-w-[180px]">{m.title}</span>
                  <span className="text-muted">{m._count.favorites}</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full"
                    style={{ width: `${(m._count.favorites / maxFavCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top viewed */}
        <div className="glass rounded-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Eye size={16} className="text-accent" />
            Top Viewed ({(totalViews._sum.views || 0).toLocaleString()} total)
          </h2>
          <div className="space-y-2">
            {viewsOverTime.map((m, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-300 truncate max-w-[200px]">{m.title}</span>
                <span className="text-muted">{m.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div className="glass rounded-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Users size={16} className="text-accent" />
            Recent Users
          </h2>
          <div className="space-y-3">
            {recentUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-300">{u.name || "Unnamed"}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${u.role === "ADMIN" ? "bg-accent/20 text-accent" : "bg-surface text-muted"}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
