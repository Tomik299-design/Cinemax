import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { MovieCard } from "@/components/movies/MovieCard";
import { Heart } from "lucide-react";
import type { Movie } from "@/types";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { movie: { include: { genres: { include: { genre: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  const movies: Movie[] = favorites.map((f) => ({
    ...f.movie,
    createdAt: f.movie.createdAt.toISOString(),
    updatedAt: f.movie.updatedAt.toISOString(),
    genres: f.movie.genres.map((mg) => mg.genre),
    isFavorite: true,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={24} className="text-accent" fill="currentColor" />
          <h1 className="text-2xl font-bold">My Favorites</h1>
          <span className="text-muted text-sm">({movies.length})</span>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <Heart size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">No favorites yet</p>
            <p className="text-sm mt-2">Browse movies and add them to your list</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
