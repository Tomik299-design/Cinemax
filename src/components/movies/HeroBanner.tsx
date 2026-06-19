"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie } from "@/types";

interface HeroBannerProps {
  movies: Movie[];
}

export function HeroBanner({ movies }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || movies.length < 2) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % movies.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  if (!movies.length) return null;

  const movie = movies[current];

  return (
    <div
      className="relative h-[70vh] md:h-[85vh] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background images */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {movie.backdropUrl && (
            <Image
              src={movie.backdropUrl}
              alt={movie.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

      {/* Content */}
      <div className="relative h-full flex items-end pb-16 md:pb-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl"
            >
              {/* Genres */}
              {movie.genres?.length > 0 && (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {movie.genres.slice(0, 3).map((g) => (
                    <span
                      key={g.id}
                      className="px-3 py-1 glass rounded-full text-xs font-medium text-gray-300"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3 leading-tight">
                {movie.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                {movie.releaseYear && <span>{movie.releaseYear}</span>}
                {movie.rating && (
                  <span className="flex items-center gap-1 text-gold">
                    <Star size={14} fill="currentColor" />
                    {movie.rating.toFixed(1)}
                  </span>
                )}
                {movie.duration && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                  </span>
                )}
              </div>

              {/* Description */}
              {movie.description && (
                <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6 leading-relaxed">
                  {movie.description}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <Link
                  href={`/movies/${movie.id}`}
                  className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl neon-glow transition-all hover:scale-105"
                >
                  <Play size={18} fill="white" />
                  Watch Now
                </Link>
                <Link
                  href={`/movies/${movie.id}`}
                  className="flex items-center gap-2 px-6 py-3 glass hover:bg-surface-2 text-white font-semibold rounded-xl transition-all"
                >
                  <Info size={18} />
                  More Info
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + movies.length) % movies.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-accent transition-colors hidden md:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % movies.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-accent transition-colors hidden md:flex"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {movies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all rounded-full ${
                i === current
                  ? "w-6 h-2 bg-accent"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
