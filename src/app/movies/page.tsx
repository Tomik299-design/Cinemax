import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { SearchBar } from "@/components/ui/SearchBar";
import { GenreFilter } from "@/components/ui/GenreFilter";
import { MovieGrid } from "@/components/movies/MovieGrid";
import type { Movie } from "@/types";

interface Props {
  searchParams: Promise<{
    genre?: string;
    year?: string;
    rating?: string;
    q?: string;
    sort?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function MoviesPage({ searchParams }: Props) {
  const { genre, year, rating, q, sort } = await searchParams;

  const orderBy =
    sort === "rating" ? { rating: "desc" as const } :
    sort === "views"  ? { views: "desc" as const } :
    sort === "year"   ? { releaseYear: "desc" as const } :
                        { createdAt: "desc" as const };

  const [movies, genres] = await Promise.all([
    prisma.movie.findMany({
      where: {
        status: "PUBLISHED",
        ...(genre ? { genres: { some: { genre: { slug: genre } } } } : {}),
        ...(year ? { releaseYear: parseInt(year) } : {}),
        ...(rating ? { rating: { gte: parseFloat(rating) } } : {}),
        ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
      },
      include: { genres: { include: { genre: true } } },
      orderBy,
      take: 60,
    }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
  ]);

  const transformedMovies: Movie[] = movies.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
    genres: m.genres.map((mg) => mg.genre),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">Browse Movies</h1>
          <p className="text-muted text-sm">{transformedMovies.length} movies available</p>
        </div>

        {/* Filters bar */}
        <div className="glass rounded-card p-4 mb-8 flex flex-wrap gap-4 items-center">
          <SearchBar defaultValue={q} />

          {/* Sort */}
          <select
            defaultValue={sort || ""}
            className="bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search);
              if (e.target.value) params.set("sort", e.target.value);
              else params.delete("sort");
              window.location.search = params.toString();
            }}
          >
            <option value="">Latest</option>
            <option value="rating">Top Rated</option>
            <option value="views">Most Viewed</option>
            <option value="year">By Year</option>
          </select>

          {/* Rating filter */}
          <select
            defaultValue={rating || ""}
            className="bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search);
              if (e.target.value) params.set("rating", e.target.value);
              else params.delete("rating");
              window.location.search = params.toString();
            }}
          >
            <option value="">Any Rating</option>
            <option value="9">9+ ★</option>
            <option value="8">8+ ★</option>
            <option value="7">7+ ★</option>
            <option value="6">6+ ★</option>
          </select>
        </div>

        {/* Genre pills */}
        <div className="mb-6">
          <GenreFilter genres={genres} active={genre} />
        </div>

        {/* Movie grid */}
        <MovieGrid movies={transformedMovies} />
      </div>
    </div>
  );
}
