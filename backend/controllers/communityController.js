const db = require('../config/db');

exports.getPublicTrips = async (req, res) => {
    try {
        const [trips] = await db.query(`
            SELECT t.*, u.name as author_name, u.profile_image 
            FROM Trips t 
            JOIN Users u ON t.user_id = u.user_id 
            WHERE t.is_public = TRUE 
            ORDER BY t.created_at DESC
        `);
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch community trips' });
    }
};
