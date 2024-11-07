const jwt = require('jsonwebtoken');

// Middleware to check user authentication without blocking access
const checkAuth = async (req, res, next) => {
    try {
        // Get the token from the cookies
        const token = req.cookies.token;  // Assuming the token is in a 'token' cookie

        if (!token) {
            // No token, set req.user to null and proceed
            req.user = null;
            return next();
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Attach the user information to the request object directly from the token
        req.user = {
            id: decoded.id,
            isAdmin: decoded.isAdmin,
            email: decoded.email  // You can add other user details if needed
        };

        // console.log("User authenticated:", req.user);
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        // Set req.user to null if token verification fails
        req.user = null;
        next();
    }
};

module.exports = checkAuth;