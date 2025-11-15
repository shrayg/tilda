import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config';

export interface JWTPayload {
  userId: number;
  email: string;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function verifyGoogleToken(idToken: string): Promise<{ email: string; name?: string; sub: string } | null> {
  // For demo, return mock data
  // In production, verify with Google's API
  if (!config.googleClientId) {
    return { email: 'test@example.com', name: 'Test User', sub: 'test' };
  }
  
  // TODO: Implement Google token verification
  // const { OAuth2Client } = require('google-auth-library');
  // const client = new OAuth2Client(config.googleClientId);
  // const ticket = await client.verifyIdToken({ idToken, audience: config.googleClientId });
  // const payload = ticket.getPayload();
  
  return null;
}

export async function verifyAppleToken(idToken: string): Promise<{ email: string; sub: string } | null> {
  // For demo, return mock data
  // In production, verify with Apple's API
  if (!config.appleClientId) {
    return { email: 'test@example.com', sub: 'test' };
  }
  
  // TODO: Implement Apple token verification
  return null;
}

