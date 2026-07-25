import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { config } from './config/index.js';
import apiRoutes from './routes/index.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';

const app = express();

const rootDir = process.cwd();

// Explicit static file routes with correct MIME types
app.get('/styles.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(path.join(rootDir, 'styles.css'));
});

app.get('/app.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(rootDir, 'app.js'));
});

app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(rootDir, 'sw.js'));
});

app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(rootDir, 'manifest.json'));
});

// Security Headers (relaxed CSP for local inline styles & lucide scripts)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));

// CORS Policy
app.use(cors({
  origin: '*',
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
