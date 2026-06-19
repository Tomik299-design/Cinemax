import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { HeroBanner } from "@/components/movies/HeroBanner";
import { MovieCarousel } from "@/components/movies/MovieCarousel";
import type { Movie } from "@/types";

async function getMoviesWithGenres(where = {}) {
  return prisma.movie.findMany({
    where: { status: "PUBLISHED", ...where },
    include: { genres: { include: { genre: true } } },
    orderBy: { createdAt: "desc" },
  });
}

function transformMovie(m: Awaited<ReturnType<typeof getMoviesWithGenres>>[0]): Movie {
  return {
    ...m,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
    genres: m.genres.map((mg) => mg.genre),
  };
}

export default async function HomePage() {
  const session = await auth();

  const [featured, latest, topRated, watchHistoryRaw] = await Promise.all([
    prisma.movie.findMany({
      where: { status: "PUBLISHED", featured: true },
      include: { genres: { include: { genre: true } } },
      take: 5,
    }),
    prisma.movie.findMany({
      where: { status: "PUBLISHED" },
      include: { genres: { include: { genre: true } } },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.movie.findMany({
      where: { status: "PUBLISHED", rating: { gte: 8 } },
      include: { genres: { include: { genre: true } } },
      orderBy: { rating: "desc" },
      take: 12,
    }),
    session?.user?.id
      ? prisma.watchHistory.findMany({
          where: { userId: session.user.id, progress: { gt: 0, lt: 100 } },
          include: { movie: { include: { genres: { include: { genre: true } } } } },
          orderBy: { updatedAt: "desc" },
          take: 8,
        })
      : [],
  ]);

  const featuredMovies = featured.map(transformMovie);
  const latestMovies = latest.map(transformMovie);
  const topRatedMovies = topRated.map(transformMovie);
  const continueWatching = watchHistoryRaw.map((wh) => ({
    ...transformMovie(wh.movie),
    watchProgress: wh.progress,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <HeroBanner movies={featuredMovies.length ? featuredMovies : latestMovies.slice(0, 5)} />

      {/* Content sections */}
      <div className="space-y-10 pb-20">
        {continueWatching.length > 0 && (
          <MovieCarousel title="Continue Watching" movies={continueWatching} />
        )}
        <MovieCarousel title="Latest Movies" movies={latestMovies} />
        <MovieCarousel title="Top Rated" movies={topRatedMovies} />
      </div>
    </div>
  );
}
