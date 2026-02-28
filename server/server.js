const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const profileRoutes = require('./routes/profileRoutes');
const eventRoutes = require('./routes/eventRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));
app.use(express.json());

app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
