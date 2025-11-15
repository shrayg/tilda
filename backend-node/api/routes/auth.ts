import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword, createToken, verifyToken, verifyGoogleToken, verifyAppleToken } from '../utils/auth';
import { verifyToken as verifyTokenMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        authProvider: 'email',
        passwordHash,
      },
    });

    const token = createToken({ userId: user.id, email: user.email });

    res.json({
      access_token: token,
      token_type: 'bearer',
      user_id: user.id,
      email: user.email,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = createToken({ userId: user.id, email: user.email });

    res.json({
      access_token: token,
      token_type: 'bearer',
      user_id: user.id,
      email: user.email,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// Google OAuth
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { id_token } = req.body;

    if (!id_token) {
      return res.status(400).json({ error: 'ID token required' });
    }

    const userInfo = await verifyGoogleToken(id_token);
    if (!userInfo) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    let user = await prisma.user.findUnique({ where: { email: userInfo.email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name,
          authProvider: 'google',
          providerId: userInfo.sub,
        },
      });
    }

    const token = createToken({ userId: user.id, email: user.email });

    res.json({
      access_token: token,
      token_type: 'bearer',
      user_id: user.id,
      email: user.email,
    });
  } catch (error: any) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: error.message || 'Google authentication failed' });
  }
});

// Apple OAuth
router.post('/apple', async (req: Request, res: Response) => {
  try {
    const { id_token, user: userData } = req.body;

    if (!id_token) {
      return res.status(400).json({ error: 'ID token required' });
    }

    const userInfo = await verifyAppleToken(id_token);
    if (!userInfo) {
      return res.status(401).json({ error: 'Invalid Apple token' });
    }

    let email = userInfo.email;
    if (userData) {
      try {
        const parsed = typeof userData === 'string' ? JSON.parse(userData) : userData;
        email = parsed.email || email;
      } catch {}
    }

    if (!email) {
      return res.status(400).json({ error: 'Email not provided' });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          authProvider: 'apple',
          providerId: userInfo.sub,
        },
      });
    }

    const token = createToken({ userId: user.id, email: user.email });

    res.json({
      access_token: token,
      token_type: 'bearer',
      user_id: user.id,
      email: user.email,
    });
  } catch (error: any) {
    console.error('Apple auth error:', error);
    res.status(500).json({ error: error.message || 'Apple authentication failed' });
  }
});

// Get current user
router.get('/me', verifyTokenMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        authProvider: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message || 'Failed to get user' });
  }
});

export default router;

