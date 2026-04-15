const dotenv = require('dotenv');
const connectDB = require('../backend/src/config/db');
const { errorHandler } = require('../backend/src/middleware/errorMiddleware');
const app = require('../backend/src/app');

dotenv.config();
connectDB();
app.use(errorHandler);

module.exports = app;
