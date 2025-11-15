import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyTokenMiddleware } from '../middleware/auth';
import { PinCategory } from '../types';

const router = Router();
const prisma = new PrismaClient();

// Get pins
router.get('/', async (req: Request, res: Response) => {
  try {
    const { min_lat, min_lng, max_lat, max_lng } = req.query;

    if (!min_lat || !min_lng || !max_lat || !max_lng) {
      return res.status(400).json({ error: 'Bounding box required' });
    }

    const pins = await prisma.pin.findMany({
      where: {
        latitude: {
          gte: parseFloat(min_lat as string),
          lte: parseFloat(max_lat as string),
        },
        longitude: {
          gte: parseFloat(min_lng as string),
          lte: parseFloat(max_lng as string),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(pins);
  } catch (error: any) {
    console.error('Error fetching pins:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch pins' });
  }
});

// Create pin (requires auth)
router.post('/', verifyTokenMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { lat, lng, category, score, description } = req.body;

    if (!lat || !lng || !category || score === undefined) {
      return res.status(400).json({ error: 'Lat, lng, category, and score required' });
    }

    if (score < 0 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 0 and 5' });
    }

    const pin = await prisma.pin.create({
      data: {
        userId,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        category: category as string,
        score: parseInt(score, 10),
        description: description || null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(pin);
  } catch (error: any) {
    console.error('Error creating pin:', error);
    res.status(500).json({ error: error.message || 'Failed to create pin' });
  }
});

// Delete pin (requires auth, owner only)
router.delete('/:id', verifyTokenMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const pinId = parseInt(req.params.id, 10);

    const pin = await prisma.pin.findUnique({ where: { id: pinId } });
    if (!pin) {
      return res.status(404).json({ error: 'Pin not found' });
    }

    if (pin.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this pin' });
    }

    await prisma.pin.delete({ where: { id: pinId } });
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting pin:', error);
    res.status(500).json({ error: error.message || 'Failed to delete pin' });
  }
});

export default router;

