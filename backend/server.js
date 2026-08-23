const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { signup, login } = require('./controllers/authController');
const authMiddleware = require('./middleware/authMiddleware');
const { getTrips, createTrip, getTripDetails, addStop, removeStop, addActivity, saveItinerary, togglePublicStatus, getPublicTripDetails } = require('./controllers/tripController');
const userController = require('./controllers/userController');
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
app.get('/api/trips/public/:id', getPublicTripDetails);

// Protected User Routes
app.get('/api/user/profile', authMiddleware, userController.getProfile);
app.put('/api/user/profile', authMiddleware, userController.updateProfile);
app.delete('/api/user/account', authMiddleware, userController.deleteAccount);

// Protected Routes (Notice the authMiddleware is passed before the controller logic)
app.get('/api/trips', authMiddleware, getTrips);
app.post('/api/trips', authMiddleware, createTrip);
app.get('/api/trips/:id', authMiddleware, getTripDetails);
app.put('/api/trips/:id/itinerary', authMiddleware, saveItinerary);
app.put('/api/trips/:id/public', authMiddleware, togglePublicStatus);

app.post('/api/trips/:id/stops', authMiddleware, addStop);
app.delete('/api/stops/:stopId', authMiddleware, removeStop);
app.post('/api/stops/:stopId/activities', authMiddleware, addActivity);

// Admin Routes (Requires both authentication and admin privileges)
const adminMiddleware = require('./middleware/adminMiddleware');
const adminController = require('./controllers/adminController');

app.get('/api/admin/stats', authMiddleware, adminMiddleware, adminController.getStats);
app.get('/api/admin/users', authMiddleware, adminMiddleware, adminController.getUsers);
app.delete('/api/admin/users/:id', authMiddleware, adminMiddleware, adminController.deleteUser);
app.get('/api/admin/trips', authMiddleware, adminMiddleware, adminController.getAllTrips);
app.get('/api/admin/popular-cities', authMiddleware, adminMiddleware, adminController.getPopularCities);
app.get('/api/admin/popular-activities', authMiddleware, adminMiddleware, adminController.getPopularActivities);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));