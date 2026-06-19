"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard, MovieCardSkeleton } from "./MovieCard";
import type { Movie } from "@/types";

interface MovieCarouselProps {
  title: string;
  movies?: Movie[];
  isLoading?: boolean;
}

export function MovieCarousel({ title, movies = [], isLoading = false }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  if (!isLoading && movies.length === 0) return null;

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
        <span className="text-sm text-muted cursor-pointer hover:text-accent transition-colors">
          See all
        </span>
      </div>

      <div className="relative group/carousel">
        {/* Left arrow */}
        {showLeft && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-8 z-10 w-16 flex items-center justify-center
              bg-gradient-to-r from-background to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-accent transition-colors">
              <ChevronLeft size={20} />
            </div>
          </motion.button>
        )}

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 pb-2"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[140px] sm:w-[160px] flex-shrink-0">
                  <MovieCardSkeleton />
                </div>
              ))
            : movies.map((movie) => (
                <div key={movie.id} className="w-[140px] sm:w-[160px] flex-shrink-0">
                  <MovieCard movie={movie} />
                </div>
              ))}
        </div>

        {/* Right arrow */}
        {showRight && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-8 z-10 w-16 flex items-center justify-center
              bg-gradient-to-l from-background to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-accent transition-colors">
              <ChevronRight size={20} />
            </div>
          </motion.button>
        )}
      </div>
    </section>
  );
}
