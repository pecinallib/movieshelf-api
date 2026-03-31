import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { AuthRequest } from '../middlewares/auth.js';

const createListSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().nullable().optional(),
});

const updateListSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
});

const addItemSchema = z.object({
  tmdbId: z.number().int().positive(),
  mediaType: z.enum(['movie', 'tv']),
  title: z.string().min(1),
  posterPath: z.string().nullable().optional(),
});

export async function createList(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { name, description } = createListSchema.parse(req.body);

    const list = await prisma.list.create({
      data: {
        userId: req.userId!,
        name,
        description: description ?? null,
      },
    });

    res.status(201).json(list);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('Erro ao criar lista:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function updateList(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const data = updateListSchema.parse(req.body);

    const list = await prisma.list.findFirst({
      where: { id, userId: req.userId! },
    });

    if (!list) {
      res.status(404).json({ error: 'Lista não encontrada' });
      return;
    }

    const updated = await prisma.list.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('Erro ao atualizar lista:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function deleteList(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    const list = await prisma.list.findFirst({
      where: { id, userId: req.userId! },
    });

    if (!list) {
      res.status(404).json({ error: 'Lista não encontrada' });
      return;
    }

    await prisma.list.delete({ where: { id } });

    res.json({ message: 'Lista removida' });
  } catch (error) {
    console.error('Erro ao deletar lista:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function getMyLists(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const lists = await prisma.list.findMany({
      where: { userId: req.userId! },
      include: { _count: { select: { items: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(lists);
  } catch (error) {
    console.error('Erro ao listar listas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function getListById(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    const list = await prisma.list.findFirst({
      where: { id, userId: req.userId! },
      include: {
        items: { orderBy: { addedAt: 'desc' } },
      },
    });

    if (!list) {
      res.status(404).json({ error: 'Lista não encontrada' });
      return;
    }

    res.json(list);
  } catch (error) {
    console.error('Erro ao buscar lista:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function addItem(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { tmdbId, mediaType, title, posterPath } = addItemSchema.parse(
      req.body,
    );

    const list = await prisma.list.findFirst({
      where: { id, userId: req.userId! },
    });

    if (!list) {
      res.status(404).json({ error: 'Lista não encontrada' });
      return;
    }

    const existing = await prisma.listItem.findUnique({
      where: {
        listId_tmdbId_mediaType: {
          listId: id,
          tmdbId,
          mediaType,
        },
      },
    });

    if (existing) {
      res.status(409).json({ error: 'Item já está na lista' });
      return;
    }

    const item = await prisma.listItem.create({
      data: {
        listId: id,
        tmdbId,
        mediaType,
        title,
        posterPath: posterPath ?? null,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    console.error('Erro ao adicionar item:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function removeItem(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const { id, itemId } = req.params;

    const list = await prisma.list.findFirst({
      where: { id, userId: req.userId! },
    });

    if (!list) {
      res.status(404).json({ error: 'Lista não encontrada' });
      return;
    }

    const item = await prisma.listItem.findFirst({
      where: { id: itemId, listId: id },
    });

    if (!item) {
      res.status(404).json({ error: 'Item não encontrado' });
      return;
    }

    await prisma.listItem.delete({ where: { id: itemId } });

    res.json({ message: 'Item removido da lista' });
  } catch (error) {
    console.error('Erro ao remover item:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
