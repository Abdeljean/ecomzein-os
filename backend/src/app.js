import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { config } from './config/index.js';
import apiRoutes from './routes/index.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';

// Zero-dependency native cookie parser middleware
const cookieParserMiddleware = (req, res, next) => {
  req.cookies = req.cookies || {};
  const cookieHeader = req.headers?.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      const name = parts.shift()?.trim();
      const value = parts.join('=')?.trim();
      if (name) {
        try {
          req.cookies[name] = decodeURIComponent(value || '');
        } catch (_) {
          req.cookies[name] = value;
        }
      }
    });
  }
  next();
};

const app = express();
app.disable('x-powered-by');

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
app.use(cors(config.cors));

// Cookie Parser Middleware for HttpOnly Auth Tokens
app.use(cookieParserMiddleware);

// Body Parser with strict payload limits (DoS Protection)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
