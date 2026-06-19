"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import type { Genre, TMDbSearchResult } from "@/types";

interface AddMovieFormProps {
  genres: Genre[];
  initialData?: Partial<MovieFormData>;
  movieId?: string;
}

interface MovieFormData {
  tmdbId?: number;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  videoUrl: string;
  releaseYear: number | "";
  duration: number | "";
  rating: number | "";
  language: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  genreIds: string[];
}

const EMPTY_FORM: MovieFormData = {
  title: "",
  description: "",
  posterUrl: "",
  backdropUrl: "",
  trailerUrl: "",
  videoUrl: "",
  releaseYear: "",
  duration: "",
  rating: "",
  language: "en",
  status: "PUBLISHED",
  featured: false,
  genreIds: [],
};

export function AddMovieForm({ genres, initialData, movieId }: AddMovieFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<MovieFormData>({ ...EMPTY_FORM, ...initialData });
  const [tmdbSearch, setTmdbSearch] = useState("");
  const [tmdbResults, setTmdbResults] = useState<TMDbSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const searchTmdb = async () => {
    if (!tmdbSearch.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(tmdbSearch)}`);
      const data = await res.json();
      setTmdbResults(data.results || []);
    } catch {
      toast.error("TMDb search failed");
    } finally {
      setSearching(false);
    }
  };

  const loadFromTmdb = async (tmdbId: number) => {
    setSearching(true);
    try {
      const res = await fetch(`/api/tmdb/movie/${tmdbId}`);
      const data = await res.json();
      const matchedGenres = genres.filter((g) =>
        data.genres?.some((tg: { id: number }) => tg.id === g.tmdbId)
      );
      setForm((prev) => ({
        ...prev,
        tmdbId: data.id,
        title: data.title || "",
        description: data.overview || "",
        posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "",
        backdropUrl: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : "",
        releaseYear: data.release_date ? parseInt(data.release_date) : "",
        duration: data.runtime || "",
        rating: data.vote_average ? parseFloat(data.vote_average.toFixed(1)) : "",
        language: data.original_language || "en",
        trailerUrl: data.trailerUrl || "",
        genreIds: matchedGenres.map((g) => g.id),
      }));
      setTmdbResults([]);
      toast.success("Movie data loaded from TMDb!");
    } catch {
      toast.error("Failed to load from TMDb");
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = movieId ? `/api/admin/movies/${movieId}` : "/api/admin/movies";
      const method = movieId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(movieId ? "Movie updated!" : "Movie added!");
      router.push("/admin/movies");
      router.refresh();
    } catch (err) {
      toast.error(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const field = (label: string, key: keyof MovieFormData, type = "text") => (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={(form[key] as string | number) ?? ""}
        onChange={(e) => setForm({ ...form, [key]: type === "number" ? (e.target.value ? +e.target.value : "") : e.target.value })}
        className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      {/* TMDb Search */}
      <div className="glass rounded-card p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Search size={16} className="text-accent" />
          Search TMDb
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={tmdbSearch}
            onChange={(e) => setTmdbSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchTmdb()}
            placeholder="Movie title or TMDb ID..."
            className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={searchTmdb}
            disabled={searching}
            className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-all disabled:opacity-60"
          >
            {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Search
          </button>
        </div>

        {tmdbResults.length > 0 && (
          <div className="mt-4 space-y-2 max-h-72 overflow-y-auto">
            {tmdbResults.map((r) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                type="button"
                onClick={() => loadFromTmdb(r.id)}
                className="w-full flex items-center gap-3 p-3 bg-surface hover:bg-surface-2 rounded-xl transition-colors text-left"
              >
                {r.poster_path && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://image.tmdb.org/t/p/w92${r.poster_path}`}
                    alt=""
                    className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted">{r.release_date?.split("-")[0]} · ★ {r.vote_average?.toFixed(1)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass rounded-card p-6 space-y-5">
        <h2 className="font-semibold">Movie Details</h2>

        {field("Title *", "title")}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {field("Poster URL", "posterUrl")}
          {field("Backdrop URL", "backdropUrl")}
          {field("YouTube Trailer URL", "trailerUrl")}
          {field("Video/Stream URL", "videoUrl")}
          {field("Release Year", "releaseYear", "number")}
          {field("Duration (min)", "duration", "number")}
          {field("Rating (0-10)", "rating", "number")}
          {field("Language", "language")}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as MovieFormData["status"] })}
            className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
          >
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Featured */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setForm({ ...form, featured: !form.featured })}
            className={`w-10 h-6 rounded-full transition-colors ${form.featured ? "bg-accent" : "bg-surface"} relative`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.featured ? "translate-x-5" : "translate-x-1"}`} />
          </div>
          <span className="text-sm text-gray-300">Featured on homepage</span>
        </label>

        {/* Genres */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Genres</label>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    genreIds: prev.genreIds.includes(g.id)
                      ? prev.genreIds.filter((id) => id !== g.id)
                      : [...prev.genreIds, g.id],
                  }))
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  form.genreIds.includes(g.id)
                    ? "bg-accent text-white"
                    : "bg-surface text-gray-400 hover:text-white"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !form.title}
          className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white font-semibold rounded-xl neon-glow transition-all"
        >
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
          {submitting ? "Saving..." : movieId ? "Update Movie" : "Add Movie"}
        </button>
      </form>
    </div>
  );
}
