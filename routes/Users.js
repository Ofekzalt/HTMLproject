const express = require("express");
const router = express.Router();
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');

const checkAuth = require('../middlewares/checkAuth');
const checkAdmin = require('../middlewares/checkAdmin');

// PUBLIC
router.post('/signup', userController.signUp);
router.post('/login', userController.logIn);

// PRIVATE
// router.delete('/user/:userId', checkAuth, checkAdmin, userController.deleteUser); 
// router.post('/logout', userController.logOut); // Add the logout route
router.get('/allusers', checkAuth, checkAdmin, userController.viewAllUsers);

module.exports = router;