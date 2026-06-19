import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const genres = await prisma.genre.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(genres);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, slug, tmdbId } = await req.json();
  const genre = await prisma.genre.create({ data: { name, slug, tmdbId } });
  return NextResponse.json(genre, { status: 201 });
}
