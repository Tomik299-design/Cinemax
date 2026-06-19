"use client";
import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { MovieCard, MovieCardSkeleton } from "./MovieCard";
import type { Movie } from "@/types";

interface MovieGridProps {
  movies: Movie[];
}

const PAGE_SIZE = 18;

export function MovieGrid({ movies }: MovieGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "200px" });

  const loadMore = useCallback(() => {
    if (visibleCount >= movies.length) return;
    setLoading(true);
    // Simulate progressive reveal for smooth UX
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + PAGE_SIZE, movies.length));
      setLoading(false);
    }, 400);
  }, [visibleCount, movies.length]);

  useEffect(() => {
    if (inView) loadMore();
  }, [inView, loadMore]);

  const visibleMovies = movies.slice(0, visibleCount);
  const hasMore = visibleCount < movies.length;

  if (movies.length === 0) {
    return (
      <div className="text-center py-20 text-muted">
        <p className="text-lg">No movies found</p>
        <p className="text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {visibleMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={`skel-${i}`} />)}
      </div>

      {/* Sentinel for infinite scroll */}
      {hasMore && <div ref={ref} className="h-10" />}

      {!hasMore && movies.length > PAGE_SIZE && (
        <p className="text-center text-muted text-sm mt-8">
          You&apos;ve reached the end · {movies.length} movies
        </p>
      )}
    </>
  );
}
