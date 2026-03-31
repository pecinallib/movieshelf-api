import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

interface TokenPayload {
  userId: string;
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
