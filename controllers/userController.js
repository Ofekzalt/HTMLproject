const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
    signUp: async (req, res) => {
        const { email, password } = req.body;
        try {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(409).json({ message: 'Email already exists.' });
            }
            const hash = await bcrypt.hash(password, 10);
            const userCount = await User.countDocuments();
            const isAdmin = userCount === 0;

            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: email.toLowerCase(),
                password: hash,
                isAdmin
            });

            await user.save();
            res.status(201).json({ message: 'User created successfully.' });
        } catch (error) {
            console.error("SignUp Error:", error);
            res.status(500).json({ message: 'An error occurred while creating the user.' });
        }
    },

    logIn: async (req, res) => {
        const { email, password } = req.body;
    
        try {
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required." });
            }
    
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Authentication failed." });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // כאן אנחנו מייצרים את הטוקן עם מידע מתוך המשתמש שנמצא ב- MongoDB
                const token = jwt.sign(
                    { id: user._id, email: user.email, isAdmin: user.isAdmin }, 
                    process.env.JWT_KEY, 
                    { expiresIn: '1h' }
                );
                
                res.cookie('token', token, { httpOnly: true, maxAge: 3600 * 1000 }); // שימור הטוקן בעוגיה
                res.status(200).json({ message: "Authentication successful.", token: token });
            } else {
                res.status(401).json({ message: "Authentication failed." });
            }
        } catch (error) {
            console.error("Login Error:", error);
            res.status(500).json({ message: "An error occurred during login." });
        }
    },

    logOut: (req, res) => {
        res.clearCookie('token');
        res.status(200).json({ message: "Logged out successfully." });
    },

    
    viewAllUsers: async (req, res) => {
        if (!req.user.isAdmin) {
            return res.status(403).json({
                message: "Permission denied. Admins only."
            });
        }

        try {
            const users = await User.find().select('-password'); // Exclude password from results
            res.status(200).json(users);
        } catch (error) {
            console.error("View all users error:", error);
            res.status(500).json({
                message: "An error occurred while retrieving users."
            });
        }
    }
};