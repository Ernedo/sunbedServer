const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const {token} = req.body; 
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    jwt.verify(token, "JWT_SECRET", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = decoded.id;
        next();
    });
};

module.exports = authenticateToken;
