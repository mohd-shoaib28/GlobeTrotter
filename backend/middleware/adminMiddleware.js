module.exports = (req, res, next) => {
    // Check if the user object exists (should be populated by authMiddleware)
    // and check if their role is admin
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
};
