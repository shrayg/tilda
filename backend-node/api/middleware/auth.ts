import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

export function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    (req as any).userId = payload.userId;
    (req as any).userEmail = payload.email;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

