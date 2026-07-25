import crypto from 'crypto';

// Generate 256-bit random key fallback if not provided in environment
const fallbackSecret = crypto.randomBytes(32).toString('hex');

export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET || fallbackSecret,
  refreshSecret: process.env.JWT_REFRESH_SECRET || fallbackSecret,
  accessExpiresIn: '15m',
  refreshExpiresIn: '30d'
};
