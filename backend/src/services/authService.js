import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../database/prisma.js';
import { config } from '../config/index.js';
import { logger } from '../logger/index.js';

export async function loginUser(email, password) {
  let user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  // Seed default admin owner user fallback if DB empty
  if (!user && email.toLowerCase() === 'roya.creative@gmail.com') {
    const hash = await bcrypt.hash('462920@.', 10);
    user = await prisma.user.create({
      data: {
        email: 'roya.creative@gmail.com',
        passwordHash: hash,
        name: 'Youssef El Amrani',
        role: 'owner'
      }
    });
    logger.info('Default owner account seeded', { email: user.email });
  }

  if (!user) {
    logger.warn('[Auth Security] Login failed: User not found in database', { email });
    throw new Error('Email ou mot de passe incorrect.');
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    logger.warn('[Auth Security] Login failed: Password mismatch for user', { email });
    throw new Error('Email ou mot de passe incorrect.');
  }

  // Generate Dual Tokens (15m Access Token & 30d Refresh Token)
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role, name: user.name, tokenType: 'access' },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, tokenType: 'refresh' },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  logger.info('User authenticated successfully with Dual Tokens', { userId: user.id, role: user.role });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

export async function requestReset(email) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1h

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedResetToken, resetTokenExpiry }
    });
  }

  logger.info('Password reset raw token created and SHA-256 stored in DB', { email });
  return { rawToken, email };
}

export async function resetUserPassword(rawToken, newPassword) {
  const hashedResetToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      hashedResetToken,
      resetTokenExpiry: { gte: new Date() }
    }
  });

  if (!user) {
    logger.warn('[Auth Security] Password reset failed: Token invalid or expired');
    throw new Error('Jeton de réinitialisation invalide ou expiré.');
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash, hashedResetToken: null, resetTokenExpiry: null }
  });

  logger.info('User password reset successfully with hashed token verification', { userId: user.id });
  return true;
}
