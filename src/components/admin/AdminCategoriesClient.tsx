"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Tag, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface GenreWithCount {
  id: string;
  name: string;
  slug: string;
  tmdbId: number | null;
  _count: { movies: number };
}

export function AdminCategoriesClient({ genres: initial }: { genres: GenreWithCount[] }) {
  const [genres, setGenres] = useState(initial);
  const [form, setForm] = useState({ name: "", slug: "", tmdbId: "" });
  const [loading, setLoading] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/genres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tmdbId: form.tmdbId ? +form.tmdbId : undefined }),
      });
      const data = await res.json();
      setGenres((prev) => [...prev, { ...data, _count: { movies: 0 } }]);
      setForm({ name: "", slug: "", tmdbId: "" });
      toast.success("Genre added!");
    } catch {
      toast.error("Failed to add genre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Add form */}
      <div className="glass rounded-card p-6">
        <h2 className="font-semibold mb-4">Add Genre</h2>
        <form onSubmit={add} className="grid grid-cols-3 gap-3">
          {[
            { label: "Name", key: "name", placeholder: "Action" },
            { label: "Slug", key: "slug", placeholder: "action" },
            { label: "TMDb ID", key: "tmdbId", placeholder: "28" },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs text-gray-400 mb-1">{label}</label>
              <input
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
              />
            </div>
          ))}
          <div className="col-span-3">
            <button
              type="submit"
              disabled={loading || !form.name || !form.slug}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-all"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add Genre
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="glass rounded-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <p className="text-sm text-muted">{genres.length} genres</p>
        </div>
        <div className="divide-y divide-border">
          {genres.map((g) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between px-6 py-4 hover:bg-surface-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Tag size={16} className="text-accent" />
                <div>
                  <p className="text-sm font-medium">{g.name}</p>
                  <p className="text-xs text-muted">/{g.slug} · {g._count.movies} movies{g.tmdbId ? ` · TMDb #${g.tmdbId}` : ""}</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  if (!confirm(`Delete "${g.name}"?`)) return;
                  await fetch(`/api/genres/${g.id}`, { method: "DELETE" });
                  setGenres((prev) => prev.filter((x) => x.id !== g.id));
                  toast.success("Genre deleted");
                }}
                className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
