const db = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        const [users] = await db.query('SELECT COUNT(*) as total FROM Users');
        const [trips] = await db.query('SELECT COUNT(*) as total FROM Trips');
        
        // Count active trips (where current date is between start and end)
        const [activeTrips] = await db.query('SELECT COUNT(*) as total FROM Trips WHERE start_date <= CURDATE() AND end_date >= CURDATE()');
        
        res.json({
            totalUsers: users[0].total,
            totalTrips: trips[0].total,
            activeTrips: activeTrips[0].total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT user_id, name, email, role, created_at FROM Users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // The foreign keys have ON DELETE CASCADE so this will delete their trips and stops as well
        await db.query('DELETE FROM Users WHERE user_id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

exports.getAllTrips = async (req, res) => {
    try {
        const query = `
            SELECT t.*, u.name as author_name, u.email as author_email 
            FROM Trips t 
            JOIN Users u ON t.user_id = u.user_id
            ORDER BY t.created_at DESC
        `;
        const [trips] = await db.query(query);
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
};

exports.getPopularCities = async (req, res) => {
    try {
        const query = `
            SELECT city as name, COUNT(*) as value
            FROM Stops
            GROUP BY city
            ORDER BY value DESC
            LIMIT 10
        `;
        const [cities] = await db.query(query);
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch popular cities' });
    }
};

exports.getPopularActivities = async (req, res) => {
    try {
        const query = `
            SELECT name, COUNT(*) as value
            FROM Activities
            GROUP BY name
            ORDER BY value DESC
            LIMIT 10
        `;
        const [activities] = await db.query(query);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch popular activities' });
    }
};
