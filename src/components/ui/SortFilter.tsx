"use client";

interface SortFilterProps {
  sort?: string;
  rating?: string;
}

export function SortFilter({ sort, rating }: SortFilterProps) {
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    window.location.search = params.toString();
  };

  return (
    <>
      {/* Sort */}
      <select
        defaultValue={sort || ""}
        className="bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
        onChange={(e) => updateParam("sort", e.target.value)}
      >
        <option value="">Latest</option>
        <option value="rating">Top Rated</option>
        <option value="views">Most Viewed</option>
        <option value="year">By Year</option>
      </select>

      {/* Rating filter */}
      <select
        defaultValue={rating || ""}
        className="bg-surface border border-border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
        onChange={(e) => updateParam("rating", e.target.value)}
      >
        <option value="">Any Rating</option>
        <option value="9">9+ ★</option>
        <option value="8">8+ ★</option>
        <option value="7">7+ ★</option>
        <option value="6">6+ ★</option>
      </select>
    </>
  );
}