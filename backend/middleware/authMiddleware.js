const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Check if the token was sent in the headers
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // 2. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach the decoded user data (like user_id) to the request object
        req.user = decoded;

        // 4. Pass control to the next middleware or route handler
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};