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

export async function POST(req: NextRequest) {
  try {
    const adminId = await requireAdmin();
    const body = await req.json();

    const { genreIds, ...movieData } = body;

    const movie = await prisma.movie.create({
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

    await logAdminAction(AdminAction.CREATE_MOVIE, "Movie", adminId, movie.id, { title: movie.title });

    return NextResponse.json(movie, { status: 201 });
  } catch (err) {
    if (String(err).includes("Unauthorized")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
