import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDbStatus } from './config/db.js';
import { store } from './services/dataStore.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customTattooRoutes from './routes/customTattooRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable reverse proxy support for Render / Vercel
app.set('trust proxy', 1);

// Configure CORS for production and development
const configuredOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or requests without origin header (e.g. mobile/postman)
      if (!origin) return callback(null, true);

      // In development or if wildcard origin is explicitly set
      if (process.env.NODE_ENV !== 'production' || configuredOrigins.includes('*')) {
        return callback(null, true);
      }

      // Check configured origins or any Vercel deployment preview / production domain
      const isAllowed =
        configuredOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1');

      if (isAllowed) {
        return callback(null, true);
      }

      // Default allow for seamless storefront API interaction
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'TWILIGHT THINKS',
    system: 'Premium Black Tattoo Studio & Custom Atelier',
    timestamp: new Date().toISOString(),
    db: getDbStatus()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-tattoos', customTattooRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// Error Handler
app.use(errorHandler);

export { app };

// Start Server if run directly (Render/Node)
const startServer = async () => {
  const isMongoConnected = await connectDB();
  await store.initialize(isMongoConnected);

  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`[TWILIGHT THINKS API] Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
      console.log(`[TWILIGHT THINKS API] Health check at http://localhost:${PORT}/api/health`);
    });
  }
};

startServer().catch(err => {
  console.error('[TWILIGHT THINKS API] Fatal startup error:', err);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
});
