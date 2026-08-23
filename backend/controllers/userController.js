const db = require('../config/db');

exports.getProfile = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT user_id, name, email, profile_image, bio, language_preference, role, created_at FROM Users WHERE user_id = ?',
            [req.user.user_id]
        );
        
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        
        res.json(users[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, bio, language_preference, profile_image } = req.body;
        
        // Update user
        await db.query(
            'UPDATE Users SET name = ?, bio = ?, language_preference = ?, profile_image = ? WHERE user_id = ?',
            [name || '', bio || '', language_preference || 'en', profile_image || '', req.user.user_id]
        );
        
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        // ON DELETE CASCADE will handle Trips, Stops, Activities
        await db.query('DELETE FROM Users WHERE user_id = ?', [req.user.user_id]);
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete account' });
    }
};
