import express from 'express';
import cors from 'cors';

const app = express();

const defaultAllowed = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

// Allow configuring frontend origin via environment variable (useful in production)
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.VERCEL_URL || '';

const allowedOrigins = new Set(defaultAllowed);
if (FRONTEND_URL) allowedOrigins.add(FRONTEND_URL.startsWith('http') ? FRONTEND_URL : `https://${FRONTEND_URL}`);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, server-side) when origin is undefined
    if (!origin) return callback(null, true);

    // allow if exact match or if it looks like a vercel or render app
    if (allowedOrigins.has(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import interestRoutes from './routes/interestRoutes.js';
import pairRoutes from './routes/pairRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import generativeRoutes from './routes/generativeRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make the uploads folder publicly accessible
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/pairs', pairRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/generative', generativeRoutes);

export default app;
