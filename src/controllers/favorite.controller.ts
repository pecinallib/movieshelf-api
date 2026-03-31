import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';

const favoriteSchema = z.object({
  tmdbId: z.number().int().positive(),
  mediaType: z.enum(['movie', 'tv']),
  title: z.string().min(1),
  posterPath: z.string().nullable().optional(),
});

export async function addFavorite(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { tmdbId, mediaType, title, posterPath } = favoriteSchema.parse(
      req.body,
    );

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId: req.userId!,
          tmdbId,
          mediaType,
        },
      },
    });

    if (existing) {
      res.status(409).json({ error: 'Já está nos favoritos' });
      return;
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.userId!,
        tmdbId,
        mediaType,
        title,
        posterPath: posterPath ?? null,
      },
    });

    res.status(201).json(favorite);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('Erro ao adicionar favorito:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function removeFavorite(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { tmdbId, mediaType } = req.params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId: req.userId!,
          tmdbId: Number(tmdbId),
          mediaType,
        },
      },
    });

    if (!favorite) {
      res.status(404).json({ error: 'Favorito não encontrado' });
      return;
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    });

    res.json({ message: 'Removido dos favoritos' });
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function listFavorites(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { type } = req.query;

    const where: { userId: string; mediaType?: string } = {
      userId: req.userId!,
    };

    if (type === 'movie' || type === 'tv') {
      where.mediaType = type;
    }

    const favorites = await prisma.favorite.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(favorites);
  } catch (error) {
    console.error('Erro ao listar favoritos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function checkFavorite(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { tmdbId, mediaType } = req.params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId: req.userId!,
          tmdbId: Number(tmdbId),
          mediaType,
        },
      },
    });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
