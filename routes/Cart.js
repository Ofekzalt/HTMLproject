const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cartController');
const checkAuth = require('../middlewares/checkAuth'); 

// Work whether user is logged in
router.get('/', checkAuth, cartController.getCart);
router.post('/add', checkAuth, cartController.addToCart); 
router.delete('/remove/:productId', checkAuth, cartController.removeFromCart);
// router.delete('/clear', checkAuth, cartController.clearCart); 

module.exports = router;