import { prisma } from "@/lib/prisma";
import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";

export default async function AdminCategoriesPage() {
  const genres = await prisma.genre.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { movies: true } } },
  });
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Categories</h1>
      <p className="text-muted text-sm mb-8">Manage movie genres and categories</p>
      <AdminCategoriesClient genres={genres} />
    </div>
  );
}
