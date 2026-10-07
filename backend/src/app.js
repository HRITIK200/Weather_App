import express from 'express';
import cors from 'cors';
import weatherRoutes from './routes/weatherRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { checkDbConnection } from './config/db.js';

const app = express();

let totalRequests = 0;
const serverStartTime = Date.now();

// Middlewares
app.use(cors());
app.use(express.json());

// Request tracking middleware
app.use((req, res, next) => {
  totalRequests++;
  next();
});
app.use(requestLogger);

// REST API Endpoints
app.use('/api/weather', weatherRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/favorites', favoritesRoutes);

// System Health & Extended Telemetry Route
app.get('/api/health', async (req, res) => {
  const isConnected = await checkDbConnection();
  const mem = process.memoryUsage();

  res.status(200).json({
    status: 'healthy',
    uptime: Math.round(process.uptime()),
    serverStartTime: new Date(serverStartTime).toISOString(),
    runtime: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    telemetry: {
      totalRequests,
      memory: {
        heapUsedMB: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100,
        heapTotalMB: Math.round((mem.heapTotal / 1024 / 1024) * 100) / 100,
        rssMB: Math.round((mem.rss / 1024 / 1024) * 100) / 100,
      },
    },
    database: {
      connected: isConnected,
      engine: 'PostgreSQL',
      mode: isConnected ? 'Live Connection Pool' : 'Resilient In-Memory Fallback',
    },
    timestamp: new Date().toISOString(),
  });
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    name: 'Weather App PERN API',
    version: '2.0.0',
    documentation: '/api/health',
  });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Middleware
app.use(errorHandler);

export default app;
