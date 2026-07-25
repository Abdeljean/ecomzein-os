import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { config } from './config/index.js';
import apiRoutes from './routes/index.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';

const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false // Allow inline PWA scripts and assets
}));

// CORS Policy
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

// Body Parser
app.use(express.json());

// Versioned API Routes (/api/v1/)
app.use('/api/v1', apiRoutes);

// Health Check Fallback
app.get('/health', (req, res) => {
  res.json({ status: 'OK', env: config.nodeEnv, timestamp: new Date().toISOString() });
});

// Serve Frontend Static Files from root directory
const rootDir = process.cwd();
app.use(express.static(rootDir));

// SPA Root and Catch-all Route
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(rootDir, 'index.html'));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;
