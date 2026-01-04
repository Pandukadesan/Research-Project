require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const vehicleRecordsBaselineRoutes = require('./routes/vehicleRecordsBaseline');
const userRoutes = require('./routes/user');
const serviceRoutes = require('./routes/service');

const app = express();

// Middleware
app.use(cors({
  origin: '*'  // allow all origins
}));
app.use(express.json());

// Routes
app.use('/api/vehicleRecordsBaseline', vehicleRecordsBaselineRoutes);
app.use('/api/user', userRoutes);
app.use('/api/service', serviceRoutes);

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Health check
app.get('/', (req, res) => {
  res.send('Vehicle Trust Backend Running');
});

const PORT = process.env.PORT || 8070;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
