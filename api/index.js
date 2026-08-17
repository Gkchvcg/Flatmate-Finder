import dotenv from 'dotenv';
import connectDB from '../backend/src/config/db.js';
import { errorHandler } from '../backend/src/middleware/errorMiddleware.js';
import app from '../backend/src/app.js';

dotenv.config();

app.use(errorHandler);

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
