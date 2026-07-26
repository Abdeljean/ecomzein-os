import express from 'express';
import path from 'path';
import app from './backend/src/app.js';
import { logger } from './backend/src/logger/index.js';

process.on('uncaughtException', (err) => {
  console.error('[Production UncaughtException]', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Production UnhandledRejection]', reason);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  logger.info(`🚀 E-comZein OS Application running on port ${port}`);
});
