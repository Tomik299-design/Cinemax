import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const genre = searchParams.get("genre");
    const year = searchParams.get("year");
    const rating = searchParams.get("rating");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    const where = {
      status: "PUBLISHED" as const,
      ...(genre ? { genres: { some: { genre: { slug: genre } } } } : {}),
      ...(year ? { releaseYear: parseInt(year) } : {}),
      ...(rating ? { rating: { gte: parseFloat(rating) } } : {}),
      ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
      ...(featured === "true" ? { featured: true } : {}),
    };

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        include: { genres: { include: { genre: true } } },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.movie.count({ where }),
    ]);

    return NextResponse.json({
      movies: movies.map((m) => ({
        ...m,
        genres: m.genres.map((mg) => mg.genre),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
