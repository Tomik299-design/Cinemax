import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddMovieForm, type MovieFormData } from "@/components/admin/AddMovieForm";

interface Props { params: Promise<{ id: string }> }

export default async function EditMoviePage({ params }: Props) {
  const { id } = await params;
  const [movie, genres] = await Promise.all([
    prisma.movie.findUnique({
      where: { id },
      include: { genres: { include: { genre: true } } },
    }),
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!movie) notFound();

 const initialData: Partial<MovieFormData> = {
    tmdbId: movie.tmdbId ?? undefined,
    title: movie.title,
    description: movie.description ?? "",
    posterUrl: movie.posterUrl ?? "",
    backdropUrl: movie.backdropUrl ?? "",
    trailerUrl: movie.trailerUrl ?? "",
    videoUrl: movie.videoUrl ?? "",
    releaseYear: movie.releaseYear ?? "",
    duration: movie.duration ?? "",
    rating: movie.rating ?? "",
    language: movie.language ?? "en",
    status: movie.status,
    featured: movie.featured,
    genreIds: movie.genres.map((mg) => mg.genreId),
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Edit Movie</h1>
      <p className="text-muted text-sm mb-8">{movie.title}</p>
      <AddMovieForm genres={genres} initialData={initialData} movieId={id} />
    </div>
  );
}
