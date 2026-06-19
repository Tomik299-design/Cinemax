import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";

export default async function AdminMoviesPage() {
  const movies = await prisma.movie.findMany({
    include: { genres: { include: { genre: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Movies</h1>
          <p className="text-muted text-sm mt-1">{movies.length} total</p>
        </div>
        <Link
          href="/admin/movies/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl neon-glow transition-all"
        >
          <Plus size={16} />
          Add Movie
        </Link>
      </div>

      <div className="glass rounded-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider">Movie</th>
              <th className="text-left px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider hidden md:table-cell">Genres</th>
              <th className="text-left px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider hidden lg:table-cell">Year</th>
              <th className="text-left px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider hidden lg:table-cell">Rating</th>
              <th className="text-left px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider">Views</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {movies.map((movie) => (
              <tr key={movie.id} className="hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-12 bg-surface rounded-lg overflow-hidden flex-shrink-0">
                      {movie.posterUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={movie.posterUrl} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{movie.title}</p>
                      {movie.tmdbId && (
                        <p className="text-xs text-muted">TMDb #{movie.tmdbId}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {movie.genres.slice(0, 2).map((mg) => (
                      <span key={mg.genreId} className="px-2 py-0.5 bg-surface rounded-full text-xs text-gray-400">
                        {mg.genre.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400 hidden lg:table-cell">
                  {movie.releaseYear}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {movie.rating && (
                    <span className="text-sm text-gold">★ {movie.rating.toFixed(1)}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    movie.status === "PUBLISHED" ? "bg-green-400/10 text-green-400" :
                    movie.status === "DRAFT" ? "bg-yellow-400/10 text-yellow-400" :
                    "bg-gray-400/10 text-gray-400"
                  }`}>
                    {movie.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{movie.views.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/movies/${movie.id}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-2 transition-colors"
                    >
                      <Eye size={14} />
                    </Link>
                    <Link
                      href={`/admin/movies/${movie.id}/edit`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-surface-2 transition-colors"
                    >
                      <Edit2 size={14} />
                    </Link>
                    <DeleteButton movieId={movie.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {movies.length === 0 && (
          <div className="text-center py-16 text-muted">
            <p>No movies yet.</p>
            <Link href="/admin/movies/new" className="text-accent hover:underline text-sm mt-2 block">
              Add your first movie
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteButton({ movieId }: { movieId: string }) {
  return (
    <form action={`/api/admin/movies/${movieId}`} method="DELETE">
      <button
        type="submit"
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-surface-2 transition-colors"
        onClick={(e) => {
          if (!confirm("Delete this movie?")) e.preventDefault();
        }}
      >
        <Trash2 size={14} />
      </button>
    </form>
  );
}
