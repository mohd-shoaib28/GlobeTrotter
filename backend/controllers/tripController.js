const db = require('../config/db');

exports.getTrips = async (req, res) => {
    try {
        const [trips] = await db.query('SELECT * FROM Trips WHERE user_id = ? ORDER BY created_at DESC', [req.user.user_id]);
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
};

exports.createTrip = async (req, res) => {
    try {
        const { name, description, start_date, end_date } = req.body;
        const [result] = await db.query(
            'INSERT INTO Trips (user_id, name, description, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
            [req.user.user_id, name, description, start_date, end_date]
        );
        res.status(201).json({ message: 'Trip created', trip_id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create trip' });
    }
};

exports.getTripDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Ensure trip belongs to user
        const [trips] = await db.query('SELECT * FROM Trips WHERE trip_id = ? AND user_id = ?', [id, req.user.user_id]);
        if (trips.length === 0) return res.status(404).json({ error: 'Trip not found' });
        const trip = trips[0];

        // Fetch stops
        const [stops] = await db.query('SELECT * FROM Stops WHERE trip_id = ? ORDER BY stop_id ASC', [id]);
        
        // Fetch activities for these stops
        const stopIds = stops.map(s => s.stop_id);
        let activities = [];
        if (stopIds.length > 0) {
            const [acts] = await db.query(`SELECT * FROM Activities WHERE stop_id IN (?) ORDER BY activity_id ASC`, [stopIds]);
            activities = acts;
        }

        // Attach activities to their respective stops
        const structuredStops = stops.map(stop => ({
            ...stop,
            activities: activities.filter(a => a.stop_id === stop.stop_id)
        }));

        res.json({ ...trip, stops: structuredStops });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch trip details' });
    }
};

exports.addStop = async (req, res) => {
    try {
        const { id } = req.params; // trip_id
        const { city, dates } = req.body;

        const [result] = await db.query(
            'INSERT INTO Stops (trip_id, city, dates) VALUES (?, ?, ?)',
            [id, city, dates]
        );
        res.status(201).json({ message: 'Stop added', stop_id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add stop' });
    }
};

exports.removeStop = async (req, res) => {
    try {
        const { stopId } = req.params;
        await db.query('DELETE FROM Stops WHERE stop_id = ?', [stopId]);
        res.json({ message: 'Stop removed' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove stop' });
    }
};

exports.addActivity = async (req, res) => {
    try {
        const { stopId } = req.params;
        const { name, category, time, cost } = req.body;

        const [result] = await db.query(
            'INSERT INTO Activities (stop_id, name, category, time, cost) VALUES (?, ?, ?, ?, ?)',
            [stopId, name, category, time, cost]
        );
        res.status(201).json({ message: 'Activity added', activity_id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add activity' });
    }
};
