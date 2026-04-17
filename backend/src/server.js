import express from 'express';
import 'dotenv/config';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import app from './app.js';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connectDB();

// errorHandler must come before catch-all for API errors to return JSON
app.use(errorHandler);

const frontendDist = join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));
app.use((req, res) => {
  res.sendFile(resolve(frontendDist, 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
