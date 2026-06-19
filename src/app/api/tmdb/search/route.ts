import { NextRequest, NextResponse } from "next/server";
import { searchTMDb } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q");
  if (!q) return NextResponse.json({ results: [] });
  try {
    const results = await searchTMDb(q);
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
