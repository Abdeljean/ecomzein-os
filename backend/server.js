import app from './src/app.js';
import { config } from './src/config/index.js';
import { logger } from './src/logger/index.js';

// Catch Unhandled Exceptions
process.on('uncaughtException', (err) => {
  logger.error('[Production UncaughtException]', { error: err.message, stack: err.stack });
});

// Catch Unhandled Promise Rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('[Production UnhandledRejection]', { reason });
});

const port = process.env.PORT || config.port || 5000;

if (process.env.PORT) {
  app.listen(process.env.PORT, () => {
    logger.info(`🚀 E-comZein REST API running on Hostinger Passenger port ${process.env.PORT}`);
    logger.info(`🔗 Health check endpoint: /api/v1/health`);
  });
} else {
  app.listen(port, () => {
    logger.info(`🚀 E-comZein REST API running on port ${port} (${config.nodeEnv})`);
    logger.info(`🔗 Health check endpoint: /api/v1/health`);
  });
}
