export interface Movie {
  id: string;
  tmdbId?: number | null;
  title: string;
  originalTitle?: string | null;
  description?: string | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  videoUrl?: string | null;
  releaseYear?: number | null;
  duration?: number | null;
  rating?: number | null;
  imdbRating?: number | null;
  language?: string | null;
  country?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  genres: Genre[];
  _count?: {
    favorites: number;
    watchHistory: number;
  };
  isFavorite?: boolean;
  watchProgress?: number;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  tmdbId?: number | null;
}

export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  movieId: string;
  createdAt: string;
  movie: Movie;
}

export interface WatchHistory {
  id: string;
  userId: string;
  movieId: string;
  progress: number;
  watchedAt: string;
  updatedAt: string;
  movie: Movie;
}

export interface AdminLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
  adminId: string;
  createdAt: string;
}

export interface TMDbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  original_language: string;
  production_countries: { iso_3166_1: string; name: string }[];
  genres: { id: number; name: string }[];
}

export interface TMDbSearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
}

export interface SiteStats {
  totalMovies: number;
  publishedMovies: number;
  totalUsers: number;
  totalViews: number;
  totalFavorites: number;
  recentMovies: Movie[];
}

export interface MovieFilters {
  genre?: string;
  year?: number;
  minRating?: number;
  search?: string;
  page?: number;
  limit?: number;
}
