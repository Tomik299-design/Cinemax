"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Play, Heart, Clock } from "lucide-react";
import type { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
  onFavoriteToggle?: (movieId: string) => void;
}

export function MovieCard({ movie, onFavoriteToggle }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isFav, setIsFav] = useState(movie.isFavorite ?? false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFav(!isFav);
    onFavoriteToggle?.(movie.id);
    try {
      await fetch("/api/favorites", {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id }),
      });
    } catch {
      setIsFav(isFav); // revert on error
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group relative flex-shrink-0 cursor-pointer"
    >
      <Link href={`/movies/${movie.id}`}>
        <div className="relative rounded-card overflow-hidden bg-surface aspect-[2/3] w-full">
          {/* Poster */}
          {movie.posterUrl && !imgError ? (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 200px"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <Play size={48} />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Hover content */}
          <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            {/* Play button */}
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center neon-glow">
                <Play size={20} fill="white" />
              </div>
            </div>

            {/* Title & meta */}
            <h3 className="text-sm font-semibold line-clamp-2 mb-1">{movie.title}</h3>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{movie.releaseYear}</span>
              {movie.rating && (
                <span className="flex items-center gap-1 text-gold">
                  <Star size={11} fill="currentColor" />
                  {movie.rating.toFixed(1)}
                </span>
              )}
            </div>

            {/* Progress bar */}
            {movie.watchProgress !== undefined && movie.watchProgress > 0 && (
              <div className="mt-2">
                <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${movie.watchProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Rating badge */}
          {movie.rating && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-gold">
              <Star size={10} fill="currentColor" />
              {movie.rating.toFixed(1)}
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-accent"
          >
            <Heart
              size={14}
              className={isFav ? "text-accent fill-accent" : "text-white"}
              fill={isFav ? "currentColor" : "none"}
            />
          </button>

          {/* Continue watching badge */}
          {movie.watchProgress !== undefined && movie.watchProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/40">
              <div
                className="h-full bg-accent"
                style={{ width: `${movie.watchProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Info below card */}
        <div className="mt-2 px-1">
          <h3 className="text-sm font-medium text-white line-clamp-1 group-hover:text-accent transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted">
            {movie.releaseYear && <span>{movie.releaseYear}</span>}
            {movie.duration && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5">
                  <Clock size={10} />
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* Skeleton */
export function MovieCardSkeleton() {
  return (
    <div className="flex-shrink-0">
      <div className="rounded-card overflow-hidden aspect-[2/3] skeleton" />
      <div className="mt-2 space-y-1.5">
        <div className="h-3.5 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/2" />
      </div>
    </div>
  );
}
