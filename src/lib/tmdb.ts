import type { TMDbMovie, TMDbSearchResult } from "@/types";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };
}

export async function searchTMDb(query: string): Promise<TMDbSearchResult[]> {
  const res = await fetch(
    `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&language=en-US`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error("TMDb search failed");
  const data = await res.json();
  return data.results || [];
}

export async function getTMDbMovie(tmdbId: number): Promise<TMDbMovie> {
  const res = await fetch(
    `${TMDB_BASE}/movie/${tmdbId}?language=en-US`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error(`TMDb movie ${tmdbId} not found`);
  return res.json();
}

export async function getTMDbTrailer(tmdbId: number): Promise<string | null> {
  const res = await fetch(
    `${TMDB_BASE}/movie/${tmdbId}/videos?language=en-US`,
    { headers: getHeaders() }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const trailer = data.results?.find(
    (v: { site: string; type: string; key: string }) =>
      v.site === "YouTube" && v.type === "Trailer"
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}

export function tmdbPosterUrl(path: string | null, size = "w500"): string {
  if (!path) return "/placeholder-poster.jpg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function tmdbBackdropUrl(path: string | null, size = "original"): string {
  if (!path) return "/placeholder-backdrop.jpg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
