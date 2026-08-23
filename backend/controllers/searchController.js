const db = require('../config/db');

exports.searchCatalog = async (req, res) => {
    try {
        const { query, type, category, country, max_cost } = req.query;
        
        if (type === 'cities') {
            let cityQuery = `SELECT * FROM Cities WHERE 1=1`;
            let params = [];
            
            if (query) {
                cityQuery += ` AND (name LIKE ? OR country LIKE ?)`;
                params.push(`%${query}%`, `%${query}%`);
            }
            if (country) {
                cityQuery += ` AND country = ?`;
                params.push(country);
            }
            
            const [results] = await db.query(cityQuery, params);
            return res.json(results);
        }
        
        // Default to activities
        let activitiesQuery = `
            SELECT a.*, c.name as city_name, c.country 
            FROM GlobalActivities a 
            JOIN Cities c ON a.city_id = c.city_id
            WHERE 1=1
        `;
        let params = [];

        if (query) {
            activitiesQuery += ` AND (a.name LIKE ? OR c.name LIKE ?)`;
            params.push(`%${query}%`, `%${query}%`);
        }
        if (category) {
            activitiesQuery += ` AND a.category = ?`;
            params.push(category);
        }
        if (max_cost) {
            activitiesQuery += ` AND a.estimated_cost <= ?`;
            params.push(parseFloat(max_cost));
        }

        const [results] = await db.query(activitiesQuery, params);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Failed to search catalog' });
    }
};
