const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Verify JWT token from Authorization header
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header' });
    }

    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Contains { id, role, iat, exp }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Generate JWT token with user ID and role
const generateToken = (id, role = 'customer') => {
    return jwt.sign(
        { id, role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

module.exports = { verifyToken, generateToken };
