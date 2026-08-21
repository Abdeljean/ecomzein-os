import { config } from '../config/index.js';
import { logger } from '../logger/index.js';

export function globalErrorHandler(err, req, res, next) {
  logger.error('[API Error]', {
    message: err.message,
    path: req.originalUrl,
    method: req.method,
    status: err.status || 500
  });

  const statusCode = err.status || 500;
  const isProd = config.nodeEnv === 'production';
  const errorMessage = (statusCode === 500 && isProd)
    ? 'Une erreur interne est survenue. Veuillez réessayer plus tard.'
    : (err.message || 'Erreur interne du serveur');

  res.status(statusCode).json({ error: errorMessage });
}
