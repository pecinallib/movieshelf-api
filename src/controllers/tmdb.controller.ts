import { Request, Response } from 'express';
import {
  searchMulti,
  getMovieDetails,
  getTVDetails,
  getTrending,
  getGenres,
  discover,
} from '../services/tmdb.service.js';

export async function search(req: Request, res: Response): Promise<void> {
  try {
    const query = req.query.q as string;
    const page = Number(req.query.page) || 1;

    if (!query) {
      res.status(400).json({ error: 'Parâmetro "q" é obrigatório' });
      return;
    }

    const results = await searchMulti(query, page);
    res.json(results);
  } catch (error) {
    console.error('Erro na busca TMDB:', error);
    res.status(500).json({ error: 'Erro ao buscar na TMDB' });
  }
}

export async function movieDetails(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const details = await getMovieDetails(id);
    res.json(details);
  } catch (error) {
    console.error('Erro ao buscar filme:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do filme' });
  }
}

export async function tvDetails(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const details = await getTVDetails(id);
    res.json(details);
  } catch (error) {
    console.error('Erro ao buscar série:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes da série' });
  }
}

export async function trending(req: Request, res: Response): Promise<void> {
  try {
    const type = (req.query.type as string) || 'all';
    const validTypes = ['all', 'movie', 'tv'];
    const mediaType = validTypes.includes(type)
      ? (type as 'all' | 'movie' | 'tv')
      : 'all';

    const results = await getTrending(mediaType, 'week');
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar trending:', error);
    res.status(500).json({ error: 'Erro ao buscar tendências' });
  }
}

export async function genres(req: Request, res: Response): Promise<void> {
  try {
    const type = (req.query.type as string) || 'movie';
    if (type !== 'movie' && type !== 'tv') {
      res.status(400).json({ error: 'Tipo deve ser "movie" ou "tv"' });
      return;
    }

    const data = await getGenres(type);
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    res.status(500).json({ error: 'Erro ao buscar gêneros' });
  }
}

export async function discoverMedia(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const type = (req.query.type as string) || 'movie';
    const genreId = req.query.genre ? Number(req.query.genre) : undefined;
    const page = Number(req.query.page) || 1;

    if (type !== 'movie' && type !== 'tv') {
      res.status(400).json({ error: 'Tipo deve ser "movie" ou "tv"' });
      return;
    }

    const data = await discover(type, genreId, page);
    res.json(data);
  } catch (error) {
    console.error('Erro ao descobrir:', error);
    res.status(500).json({ error: 'Erro ao buscar conteúdo' });
  }
}
