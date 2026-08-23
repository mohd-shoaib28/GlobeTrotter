const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { signup, login } = require('./controllers/authController');
const authMiddleware = require('./middleware/authMiddleware');
const { getTrips, createTrip, getTripDetails, addStop, removeStop, addActivity } = require('./controllers/tripController');
const { getPublicTrips } = require('./controllers/communityController');
const { searchCatalog } = require('./controllers/searchController');

const app = express();
app.use(cors());
app.use(express.json());

// Public Routes
app.post('/api/auth/signup', signup);
app.post('/api/auth/login', login);
app.get('/api/community', getPublicTrips);
app.get('/api/search', searchCatalog);

// Protected Routes (Notice the authMiddleware is passed before the controller logic)
app.get('/api/trips', authMiddleware, getTrips);
app.post('/api/trips', authMiddleware, createTrip);
app.get('/api/trips/:id', authMiddleware, getTripDetails);

app.post('/api/trips/:id/stops', authMiddleware, addStop);
app.delete('/api/stops/:stopId', authMiddleware, removeStop);
app.post('/api/stops/:stopId/activities', authMiddleware, addActivity);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));