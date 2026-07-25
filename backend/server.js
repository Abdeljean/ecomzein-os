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

app.listen(config.port, () => {
  logger.info(`🚀 E-comZein REST API running on port ${config.port} (${config.nodeEnv})`);
  logger.info(`🔗 Health check endpoint: /api/v1/health`);
});
