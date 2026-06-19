import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { SearchBar } from "@/components/ui/SearchBar";
import { GenreFilter } from "@/components/ui/GenreFilter";
import { SortFilter } from "@/components/ui/SortFilter";
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
          <SortFilter sort={sort} rating={rating} />
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