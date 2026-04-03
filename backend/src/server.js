const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/interests', require('./routes/interestRoutes'));
// app.use('/api/external-places', require('./routes/externalPlaceRoutes'));


const path = require('path');
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));
app.use((req, res) => {
  res.sendFile(path.resolve(frontendDist, 'index.html'));
});

// errorHandler should be at the end
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
