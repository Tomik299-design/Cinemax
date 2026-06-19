import { prisma } from "@/lib/prisma";
import { AddMovieForm } from "@/components/admin/AddMovieForm";

export default async function NewMoviePage() {
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Add Movie</h1>
      <p className="text-muted text-sm mb-8">Search TMDb or enter data manually</p>
      <AddMovieForm genres={genres} />
    </div>
  );
}
