import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logAdminAction } from "@/lib/admin-log";
import { AdminAction } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const adminId = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { genreIds, ...movieData } = body;

    // Replace genres
    await prisma.movieGenre.deleteMany({ where: { movieId: id } });

    const movie = await prisma.movie.update({
      where: { id },
      data: {
        ...movieData,
        releaseYear: movieData.releaseYear || null,
        duration: movieData.duration || null,
        rating: movieData.rating || null,
        genres: {
          create: (genreIds || []).map((gid: string) => ({ genreId: gid })),
        },
      },
      include: { genres: { include: { genre: true } } },
    });

    await logAdminAction(AdminAction.UPDATE_MOVIE, "Movie", adminId, id, { title: movie.title });
    return NextResponse.json(movie);
  } catch (err) {
    if (String(err).includes("Unauthorized")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const adminId = await requireAdmin();
    const { id } = await params;
    await prisma.movie.delete({ where: { id } });
    await logAdminAction(AdminAction.DELETE_MOVIE, "Movie", adminId, id);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (String(err).includes("Unauthorized")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
