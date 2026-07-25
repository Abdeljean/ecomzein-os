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

const port = parseInt(process.env.PORT || config.port || '5000', 10);

app.listen(port, '0.0.0.0', () => {
  logger.info(`🚀 E-comZein REST API running on port ${port} (${config.nodeEnv})`);
  logger.info(`🔗 Health check endpoint: /api/v1/health`);
});
