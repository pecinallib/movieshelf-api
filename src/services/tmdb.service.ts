import { env } from '../config/env.js';

const headers = {
  Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

interface TMDBResponse {
  results: unknown[];
  page: number;
  total_pages: number;
  total_results: number;
}

export async function searchMulti(
  query: string,
  page = 1,
): Promise<TMDBResponse> {
  const url = `${env.TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&page=${page}&language=pt-BR&include_adult=false`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export async function getMovieDetails(movieId: number) {
  const url = `${env.TMDB_BASE_URL}/movie/${movieId}?language=pt-BR&append_to_response=credits,videos`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export async function getTVDetails(tvId: number) {
  const url = `${env.TMDB_BASE_URL}/tv/${tvId}?language=pt-BR&append_to_response=credits,videos`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export async function getTrending(
  mediaType: 'movie' | 'tv' | 'all' = 'all',
  timeWindow: 'day' | 'week' = 'week',
) {
  const url = `${env.TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?language=pt-BR`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export async function getRecommendations(
  mediaType: 'movie' | 'tv',
  id: number,
) {
  const url = `${env.TMDB_BASE_URL}/${mediaType}/${id}/recommendations?language=pt-BR`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export async function getGenres(mediaType: 'movie' | 'tv') {
  const url = `${env.TMDB_BASE_URL}/genre/${mediaType}/list?language=pt-BR`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export async function discover(
  mediaType: 'movie' | 'tv',
  genreId?: number,
  page = 1,
) {
  let url = `${env.TMDB_BASE_URL}/discover/${mediaType}?language=pt-BR&page=${page}&sort_by=popularity.desc`;

  if (genreId) {
    url += `&with_genres=${genreId}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}
