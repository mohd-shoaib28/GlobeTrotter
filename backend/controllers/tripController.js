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
        const { name, description, start_date, end_date, cover_photo } = req.body;
        const [result] = await db.query(
            'INSERT INTO Trips (user_id, name, description, start_date, end_date, cover_photo) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.user_id, name, description, start_date, end_date, cover_photo || '']
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

exports.saveItinerary = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { id } = req.params;
        const { sections } = req.body; // sections array

        // Verify trip ownership
        const [trips] = await connection.query('SELECT * FROM Trips WHERE trip_id = ? AND user_id = ?', [id, req.user.user_id]);
        if (trips.length === 0) {
            connection.release();
            return res.status(404).json({ error: 'Trip not found or unauthorized' });
        }

        await connection.beginTransaction();

        // Remove old stops (which cascades and removes old activities)
        await connection.query('DELETE FROM Stops WHERE trip_id = ?', [id]);

        // Insert new stops and activities
        for (const section of sections) {
            const [stopResult] = await connection.query(
                'INSERT INTO Stops (trip_id, city, dates, info, budget_estimate) VALUES (?, ?, ?, ?, ?)',
                [id, section.title || 'Untitled Section', section.dateRange || '', section.info || '', section.budget || 0]
            );
            
            const stopId = stopResult.insertId;

            if (section.activities && Array.isArray(section.activities)) {
                for (const act of section.activities) {
                    await connection.query(
                        'INSERT INTO Activities (stop_id, name, category, time, cost) VALUES (?, ?, ?, ?, ?)',
                        [stopId, act.name || 'Unnamed', act.category || 'General', act.time || '', act.cost || 0]
                    );
                }
            }
        }

        await connection.commit();
        res.json({ message: 'Itinerary saved successfully' });
    } catch (err) {
        await connection.rollback();
        console.error("Failed to save itinerary:", err);
        res.status(500).json({ error: 'Failed to save itinerary' });
    } finally {
        connection.release();
    }
};

exports.togglePublicStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_public } = req.body;
        
        const [result] = await db.query(
            'UPDATE Trips SET is_public = ? WHERE trip_id = ? AND user_id = ?',
            [is_public ? 1 : 0, id, req.user.user_id]
        );
        
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Trip not found or unauthorized' });
        
        res.json({ message: 'Trip sharing status updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update sharing status' });
    }
};

exports.getPublicTripDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [trips] = await db.query(
            'SELECT t.*, u.name as author_name FROM Trips t JOIN Users u ON t.user_id = u.user_id WHERE t.trip_id = ? AND t.is_public = TRUE', 
            [id]
        );
        if (trips.length === 0) return res.status(404).json({ error: 'Trip not found or is private' });
        const trip = trips[0];

        // Fetch stops
        const [stops] = await db.query('SELECT * FROM Stops WHERE trip_id = ? ORDER BY stop_id ASC', [id]);
        
        // Fetch activities
        const stopIds = stops.map(s => s.stop_id);
        let activities = [];
        if (stopIds.length > 0) {
            const [acts] = await db.query(`SELECT * FROM Activities WHERE stop_id IN (?) ORDER BY activity_id ASC`, [stopIds]);
            activities = acts;
        }

        const structuredStops = stops.map(stop => ({
            ...stop,
            activities: activities.filter(a => a.stop_id === stop.stop_id)
        }));

        res.json({ ...trip, stops: structuredStops });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch public trip details' });
    }
};
