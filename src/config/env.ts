import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 3333,
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  TMDB_API_KEY: process.env.TMDB_API_KEY!,
  TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN!,
  TMDB_BASE_URL: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
};
