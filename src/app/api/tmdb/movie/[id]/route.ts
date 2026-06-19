import { NextRequest, NextResponse } from "next/server";
import { getTMDbMovie, getTMDbTrailer } from "@/lib/tmdb";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const [movie, trailerUrl] = await Promise.all([
      getTMDbMovie(parseInt(id)),
      getTMDbTrailer(parseInt(id)),
    ]);
    return NextResponse.json({ ...movie, trailerUrl });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
