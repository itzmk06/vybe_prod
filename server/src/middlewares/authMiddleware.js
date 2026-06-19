const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized! Please log in." });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select('-password -refreshToken');

        if (!user) {
            return res.status(401).json({ message: "User not found! Please log in again." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired!" });
        }
        
        return res.status(401).json({ message: "Invalid token! Please log in again." });
    }
};

module.exports = { userAuth };