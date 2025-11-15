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
  // Require Google Client ID to be configured for authentication
  if (!config.googleClientId) {
    return null;
  }
  
  // TODO: Implement Google token verification
  // const { OAuth2Client } = require('google-auth-library');
  // const client = new OAuth2Client(config.googleClientId);
  // const ticket = await client.verifyIdToken({ idToken, audience: config.googleClientId });
  // const payload = ticket.getPayload();
  // if (payload) {
  //   return {
  //     email: payload.email || '',
  //     name: payload.name,
  //     sub: payload.sub || '',
  //   };
  // }
  
  return null;
}

export async function verifyAppleToken(idToken: string): Promise<{ email: string; sub: string } | null> {
  // Require Apple Client ID to be configured for authentication
  if (!config.appleClientId) {
    return null;
  }
  
  // TODO: Implement Apple token verification
  // Verify the token using Apple's JWT verification
  // Extract email and sub from verified token payload
  // Return { email: payload.email, sub: payload.sub } if valid
  // Return null if invalid or verification fails
  
  return null;
}

