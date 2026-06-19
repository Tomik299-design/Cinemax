import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { MovieCard } from "@/components/movies/MovieCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { GenreFilter } from "@/components/ui/GenreFilter";
import type { Movie } from "@/types";

interface Props {
  searchParams: Promise<{ q?: string; genre?: string; year?: string; rating?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, genre, year, rating } = await searchParams;

  const [movies, genres] = await Promise.all([
    prisma.movie.findMany({
      where: {
        status: "PUBLISHED",
        ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
        ...(genre ? { genres: { some: { genre: { slug: genre } } } } : {}),
        ...(year ? { releaseYear: parseInt(year) } : {}),
        ...(rating ? { rating: { gte: parseFloat(rating) } } : {}),
      },
      include: { genres: { include: { genre: true } } },
      orderBy: { rating: "desc" },
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
        <h1 className="text-2xl font-bold mb-6">
          {q ? `Results for "${q}"` : "Browse Movies"}
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <SearchBar defaultValue={q} />
          <GenreFilter genres={genres} active={genre} />
        </div>

        {/* Results */}
        {transformedMovies.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-lg">No movies found</p>
            <p className="text-sm mt-2">Try a different search or filter</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted mb-4">{transformedMovies.length} movies</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {transformedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
