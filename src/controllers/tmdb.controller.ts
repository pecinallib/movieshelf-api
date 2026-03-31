import { Request, Response } from 'express';
import {
  searchMulti,
  getMovieDetails,
  getTVDetails,
  getTrending,
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
    const results = await getTrending('all', 'week');
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar trending:', error);
    res.status(500).json({ error: 'Erro ao buscar tendências' });
  }
}
