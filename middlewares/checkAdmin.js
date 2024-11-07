const jwt = require('jsonwebtoken');


// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {

  
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();  // Proceed if the user is an admin
};

module.exports =  checkAdmin ;