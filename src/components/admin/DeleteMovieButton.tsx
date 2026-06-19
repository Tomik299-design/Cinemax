"use client";

import { Trash2 } from "lucide-react";

export function DeleteMovieButton({ movieId }: { movieId: string }) {
  return (
    <form action={`/api/admin/movies/${movieId}`} method="DELETE">
      <button
        type="submit"
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-surface-2 transition-colors"
        onClick={(e) => {
          if (!confirm("Delete this movie?")) e.preventDefault();
        }}
      >
        <Trash2 size={14} />
      </button>
    </form>
  );
}