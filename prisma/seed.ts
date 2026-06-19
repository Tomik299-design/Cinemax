import { PrismaClient, Role, MovieStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@cinemax.com" },
    update: {},
    create: {
      email: "admin@cinemax.com",
      name: "Admin",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create demo user
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@cinemax.com" },
    update: {},
    create: {
      email: "demo@cinemax.com",
      name: "Demo User",
      password: userPassword,
      role: Role.USER,
    },
  });
  console.log("✅ Demo user created:", user.email);

  // Create genres
  const genreData = [
    { name: "Action", slug: "action", tmdbId: 28 },
    { name: "Adventure", slug: "adventure", tmdbId: 12 },
    { name: "Animation", slug: "animation", tmdbId: 16 },
    { name: "Comedy", slug: "comedy", tmdbId: 35 },
    { name: "Crime", slug: "crime", tmdbId: 80 },
    { name: "Documentary", slug: "documentary", tmdbId: 99 },
    { name: "Drama", slug: "drama", tmdbId: 18 },
    { name: "Fantasy", slug: "fantasy", tmdbId: 14 },
    { name: "Horror", slug: "horror", tmdbId: 27 },
    { name: "Mystery", slug: "mystery", tmdbId: 9648 },
    { name: "Romance", slug: "romance", tmdbId: 10749 },
    { name: "Sci-Fi", slug: "sci-fi", tmdbId: 878 },
    { name: "Thriller", slug: "thriller", tmdbId: 53 },
  ];

  const genres: Record<string, string> = {};
  for (const g of genreData) {
    const genre = await prisma.genre.upsert({
      where: { slug: g.slug },
      update: {},
      create: g,
    });
    genres[g.slug] = genre.id;
  }
  console.log("✅ Genres created:", Object.keys(genres).length);

  // Create sample movies (metadata only — no illegal content)
  const movies = [
    {
      tmdbId: 550,
      title: "Fight Club",
      description:
        "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
      posterUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzVMTFn.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=qtRKdVHc-cE",
      releaseYear: 1999,
      duration: 139,
      rating: 8.4,
      language: "en",
      status: MovieStatus.PUBLISHED,
      featured: true,
      genres: ["drama", "thriller"],
    },
    {
      tmdbId: 238,
      title: "The Godfather",
      description:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLeMMovrE0is.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=sY1S34973zA",
      releaseYear: 1972,
      duration: 175,
      rating: 9.2,
      language: "en",
      status: MovieStatus.PUBLISHED,
      featured: true,
      genres: ["drama", "crime"],
    },
    {
      tmdbId: 13,
      title: "Forrest Gump",
      description:
        "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold through the perspective of an Alabama man.",
      posterUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/qdIMHd4sEfJSckfVJfKQvisL02a.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=bLvqoHBptjg",
      releaseYear: 1994,
      duration: 142,
      rating: 8.8,
      language: "en",
      status: MovieStatus.PUBLISHED,
      featured: false,
      genres: ["drama", "romance"],
    },
    {
      tmdbId: 27205,
      title: "Inception",
      description:
        "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
      releaseYear: 2010,
      duration: 148,
      rating: 8.8,
      language: "en",
      status: MovieStatus.PUBLISHED,
      featured: true,
      genres: ["action", "sci-fi", "thriller"],
    },
    {
      tmdbId: 157336,
      title: "Interstellar",
      description:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
      releaseYear: 2014,
      duration: 169,
      rating: 8.6,
      language: "en",
      status: MovieStatus.PUBLISHED,
      featured: false,
      genres: ["adventure", "drama", "sci-fi"],
    },
    {
      tmdbId: 278,
      title: "The Shawshank Redemption",
      description:
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      posterUrl: "https://image.tmdb.org/t/p/w500/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=PLl99DlL6b4",
      releaseYear: 1994,
      duration: 142,
      rating: 9.3,
      language: "en",
      status: MovieStatus.PUBLISHED,
      featured: false,
      genres: ["drama"],
    },
  ];

  for (const movieData of movies) {
    const { genres: movieGenres, ...data } = movieData;
    const movie = await prisma.movie.upsert({
      where: { tmdbId: data.tmdbId },
      update: {},
      create: data,
    });

    for (const slug of movieGenres) {
      const genreId = genres[slug];
      if (genreId) {
        await prisma.movieGenre.upsert({
          where: { movieId_genreId: { movieId: movie.id, genreId } },
          update: {},
          create: { movieId: movie.id, genreId },
        });
      }
    }
  }
  console.log("✅ Movies seeded:", movies.length);
  console.log("\n🎬 Seed complete!");
  console.log("Admin: admin@cinemax.com / admin123");
  console.log("User:  demo@cinemax.com  / user123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
