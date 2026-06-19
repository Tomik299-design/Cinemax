import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { movie: { include: { genres: { include: { genre: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favorites.map((f) => ({
    ...f,
    movie: { ...f.movie, genres: f.movie.genres.map((mg) => mg.genre) },
  })));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { movieId } = await req.json();
  const fav = await prisma.favorite.upsert({
    where: { userId_movieId: { userId: session.user.id, movieId } },
    create: { userId: session.user.id, movieId },
    update: {},
  });
  return NextResponse.json(fav, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { movieId } = await req.json();
  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, movieId },
  });
  return NextResponse.json({ success: true });
}
