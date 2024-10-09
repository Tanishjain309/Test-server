import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Split 'Bearer token'

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    //Verifying the token received in request
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = user; // Attach user info to the request
        next();
    });
};

export default verifyToken;