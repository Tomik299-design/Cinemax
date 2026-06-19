import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { MoviePlayer } from "@/components/movies/MoviePlayer";
import { Star, Clock, Calendar, Globe, Heart, Share2 } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const [movie, isFavorite] = await Promise.all([
    prisma.movie.findUnique({
      where: { id },
      include: {
        genres: { include: { genre: true } },
        _count: { select: { favorites: true } },
      },
    }),
    session?.user?.id
      ? prisma.favorite.findUnique({
          where: { userId_movieId: { userId: session.user.id, movieId: id } },
        })
      : null,
  ]);

  if (!movie) notFound();

  // Increment views
  await prisma.movie.update({ where: { id }, data: { views: { increment: 1 } } });

  const genres = movie.genres.map((mg) => mg.genre);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Backdrop */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {movie.backdropUrl && (
          <Image
            src={movie.backdropUrl}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent" />
      </div>

      {/* Main content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-48 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-40 md:w-60 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-card overflow-hidden shadow-2xl shadow-black/60">
              {movie.posterUrl ? (
                <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center text-muted">No Image</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            {/* Genres */}
            <div className="flex gap-2 flex-wrap mb-3">
              {genres.map((g) => (
                <Link
                  key={g.id}
                  href={`/movies?genre=${g.slug}`}
                  className="px-3 py-1 glass rounded-full text-xs text-gray-300 hover:text-accent transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-black mb-2 leading-tight">{movie.title}</h1>
            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="text-muted text-sm mb-4">{movie.originalTitle}</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
              {movie.rating && (
                <span className="flex items-center gap-1.5 text-gold font-semibold text-base">
                  <Star size={16} fill="currentColor" />
                  {movie.rating.toFixed(1)}
                  <span className="text-muted font-normal text-xs">/ 10</span>
                </span>
              )}
              {movie.releaseYear && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {movie.releaseYear}
                </span>
              )}
              {movie.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
              )}
              {movie.language && (
                <span className="flex items-center gap-1.5">
                  <Globe size={14} />
                  {movie.language.toUpperCase()}
                </span>
              )}
              <span className="text-muted">{movie.views.toLocaleString()} views</span>
            </div>

            {/* Description */}
            {movie.description && (
              <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl">{movie.description}</p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">
              {movie.videoUrl || movie.trailerUrl ? (
                <Link
                  href={`#player`}
                  className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover font-semibold rounded-xl neon-glow transition-all"
                >
                  ▶ Watch Now
                </Link>
              ) : (
                <button disabled className="flex items-center gap-2 px-6 py-3 bg-surface text-muted font-semibold rounded-xl cursor-not-allowed">
                  ▶ Not Available
                </button>
              )}
              <form action={`/api/favorites`} method="POST">
                <input type="hidden" name="movieId" value={movie.id} />
                <button
                  type="submit"
                  className={`flex items-center gap-2 px-6 py-3 glass rounded-xl font-semibold transition-all hover:bg-surface-2 ${
                    isFavorite ? "text-accent" : "text-white"
                  }`}
                >
                  <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                  {isFavorite ? "Saved" : "Add to List"}
                </button>
              </form>
              <button className="flex items-center gap-2 px-4 py-3 glass rounded-xl text-gray-400 hover:text-white transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Player section */}
        {(movie.videoUrl || movie.trailerUrl) && (
          <div id="player" className="mt-10">
            <h2 className="text-xl font-bold mb-4">
              {movie.videoUrl ? "Watch" : "Trailer"}
            </h2>
            <MoviePlayer
              videoUrl={movie.videoUrl || movie.trailerUrl || ""}
              movieId={movie.id}
              userId={session?.user?.id}
            />
          </div>
        )}
      </div>
    </div>
  );
}
