import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import apiRoutes from './routes.js';

const app = express();

// Security Headers
app.use(helmet());

// CORS Policy
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

// Body Parser
app.use(express.json());

// Rate Limiter for Login Endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' }
});

app.use('/api/v1/auth/login', loginLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', env: config.nodeEnv, timestamp: new Date().toISOString() });
});

// Versioned API Routes
app.use('/api/v1', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Nobti Backend Error]:', err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Start Server
app.listen(config.port, () => {
  console.log(`🚀 Nobti CRM REST API Server running on port ${config.port} (${config.nodeEnv})`);
  console.log(`🔗 Health check: http://localhost:${config.port}/health`);
});
