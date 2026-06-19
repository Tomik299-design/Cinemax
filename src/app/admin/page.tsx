import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Film, Users, Eye, Heart, TrendingUp, Plus } from "lucide-react";

async function getStats() {
  const [totalMovies, publishedMovies, totalUsers, totalFavorites, recentMovies, topMovies] =
    await Promise.all([
      prisma.movie.count(),
      prisma.movie.count({ where: { status: "PUBLISHED" } }),
      prisma.user.count(),
      prisma.favorite.count(),
      prisma.movie.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { genres: { include: { genre: true } } },
      }),
      prisma.movie.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { views: "desc" },
        take: 5,
      }),
    ]);

  const totalViews = await prisma.movie.aggregate({ _sum: { views: true } });

  return { totalMovies, publishedMovies, totalUsers, totalFavorites, recentMovies, topMovies, totalViews: totalViews._sum.views || 0 };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: "Total Movies", value: stats.totalMovies, icon: Film, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Published", value: stats.publishedMovies, icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Users", value: stats.totalUsers, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Total Views", value: stats.totalViews.toLocaleString(), icon: Eye, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Favorites", value: stats.totalFavorites, icon: Heart, color: "text-accent", bg: "bg-accent/10" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Overview of your platform</p>
        </div>
        <Link
          href="/admin/movies/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl neon-glow transition-all"
        >
          <Plus size={16} />
          Add Movie
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass rounded-card p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-muted text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Movies */}
        <div className="glass rounded-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recently Added</h2>
            <Link href="/admin/movies" className="text-xs text-accent hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {stats.recentMovies.map((movie) => (
              <div key={movie.id} className="flex items-center gap-3">
                <div className="w-8 h-12 bg-surface rounded-lg overflow-hidden flex-shrink-0">
                  {movie.posterUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={movie.posterUrl} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{movie.title}</p>
                  <p className="text-xs text-muted">{movie.releaseYear} · {movie.status}</p>
                </div>
                <Link href={`/admin/movies/${movie.id}/edit`} className="text-xs text-accent hover:underline">
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Top viewed */}
        <div className="glass rounded-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Most Viewed</h2>
          </div>
          <div className="space-y-3">
            {stats.topMovies.map((movie, i) => (
              <div key={movie.id} className="flex items-center gap-3">
                <span className="text-lg font-black text-muted w-6">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{movie.title}</p>
                  <p className="text-xs text-muted">{movie.views.toLocaleString()} views</p>
                </div>
                {movie.rating && (
                  <span className="text-xs text-gold">★ {movie.rating.toFixed(1)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
