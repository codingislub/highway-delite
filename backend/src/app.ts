dotenv.config();
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './utils/db.js';
import experiencesRouter from './routes/experiences.js';
import bookingsRouter from './routes/bookings.js';
import promoRouter from './routes/promo.js';
import healthRouter from './routes/health.js';

dotenv.config();

export async function createApp() {
  const app = express();
  app.use(express.json());
  // Debug log for CORS_ORIGIN
  console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
  // Hardcode CORS to '*' for troubleshooting
  app.use(cors({ origin: '*' }));

  app.get('/', (_req, res) => res.json({ name: 'Highway API', version: '0.1.0' }));
  app.use('/health', healthRouter);
  app.use('/experiences', experiencesRouter);
  app.use('/bookings', bookingsRouter);
  app.use('/promo', promoRouter);

  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error('DATABASE_URL not set');
  await initDB(uri);

  return app;
}
