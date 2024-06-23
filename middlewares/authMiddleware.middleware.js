const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key

 const checkTokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization; 

    // console.log({token});
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token expired. Please log in again." });
            } else {
                return res.status(401).json({ message: "Invalid token." });
            }
        }
        req.userId = decoded.userId;
        next();
    });
};


const checkRestaurantMiddleware = (req, res, next) => {
    const userType = req.decodedUser.userType;
    if (userType !== 'admin') {
        return res.status(403).json({ message: "Forbidden. User does not have required permissions." });
    }
    next();
};

const checkAdminMiddleware = (req, res, next) => {
    const userType = req.decodedUser.userType;
    if (userType !== 'admin') {
        return res.status(403).json({ message: "Forbidden. User does not have required permissions." });
    }
    next();
};


module.exports ={ checkAdminMiddleware ,checkTokenMiddleware }
