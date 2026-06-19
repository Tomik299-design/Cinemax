"use client";
import { useRouter } from "next/navigation";
import type { Genre } from "@/types";

interface GenreFilterProps {
  genres: Genre[];
  active?: string;
}

export function GenreFilter({ genres, active }: GenreFilterProps) {
  const router = useRouter();

  const toggle = (slug: string) => {
    const params = new URLSearchParams(window.location.search);
    if (active === slug) {
      params.delete("genre");
    } else {
      params.set("genre", slug);
    }
    router.push(`/search?${params}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => toggle(g.slug)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            active === g.slug
              ? "bg-accent text-white neon-glow"
              : "glass text-gray-300 hover:text-white"
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
