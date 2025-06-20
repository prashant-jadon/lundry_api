const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Try to get token from cookie first, then from Authorization header
    let token = null;
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"
    }
    if (!token) return res.status(401).json({ message: 'Token required' });

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;