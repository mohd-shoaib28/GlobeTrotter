const db = require('../config/db');

exports.searchCatalog = async (req, res) => {
    try {
        const { query } = req.query;
        
        let activitiesQuery = `
            SELECT a.*, c.name as city_name, c.country 
            FROM GlobalActivities a 
            JOIN Cities c ON a.city_id = c.city_id
        `;
        let params = [];

        if (query) {
            activitiesQuery += ` WHERE a.name LIKE ? OR c.name LIKE ?`;
            params = [`%${query}%`, `%${query}%`];
        }

        const [results] = await db.query(activitiesQuery, params);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Failed to search catalog' });
    }
};
