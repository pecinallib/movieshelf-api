import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';

const reviewSchema = z.object({
  tmdbId: z.number().int().positive(),
  mediaType: z.enum(['movie', 'tv']),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable().optional(),
});

const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().nullable().optional(),
});

export async function createReview(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { tmdbId, mediaType, rating, comment } = reviewSchema.parse(req.body);

    const existing = await prisma.review.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId: req.userId!,
          tmdbId,
          mediaType,
        },
      },
    });

    if (existing) {
      res.status(409).json({ error: 'Você já avaliou este título' });
      return;
    }

    const review = await prisma.review.create({
      data: {
        userId: req.userId!,
        tmdbId,
        mediaType,
        rating,
        comment: comment ?? null,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues[0].message });
      return;
    }
    console.error('Erro ao criar review:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function updateReview(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const tmdbId = req.params.tmdbId as string;
    const mediaType = req.params.mediaType as string;
    const data = updateReviewSchema.parse(req.body);

    const review = await prisma.review.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId: req.userId!,
          tmdbId: Number(tmdbId),
          mediaType,
        },
      },
    });

    if (!review) {
      res.status(404).json({ error: 'Review não encontrada' });
      return;
    }

    const updated = await prisma.review.update({
      where: { id: review.id },
      data,
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues[0].message });
      return;
    }
    console.error('Erro ao atualizar review:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function deleteReview(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const tmdbId = req.params.tmdbId as string;
    const mediaType = req.params.mediaType as string;

    const review = await prisma.review.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId: req.userId!,
          tmdbId: Number(tmdbId),
          mediaType,
        },
      },
    });

    if (!review) {
      res.status(404).json({ error: 'Review não encontrada' });
      return;
    }

    await prisma.review.delete({
      where: { id: review.id },
    });

    res.json({ message: 'Review removida' });
  } catch (error) {
    console.error('Erro ao deletar review:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function listMyReviews(
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

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews);
  } catch (error) {
    console.error('Erro ao listar reviews:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function getReview(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const tmdbId = req.params.tmdbId as string;
    const mediaType = req.params.mediaType as string;

    const review = await prisma.review.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId: req.userId!,
          tmdbId: Number(tmdbId),
          mediaType,
        },
      },
    });

    if (!review) {
      res.status(404).json({ error: 'Review não encontrada' });
      return;
    }

    res.json(review);
  } catch (error) {
    console.error('Erro ao buscar review:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
