const express = require("express");
const router = express.Router();
const viewsController = require('../controllers/viewControllers');
const checkAdmin = require('../middlewares/checkAdmin');

router.get('/',viewsController.getHomePage);
router.get('/login',viewsController.getLoginPage);
router.get('/about',checkAdmin,viewsController.getAboutPage);
router.get('/contact',viewsController.getContactPage);
router.get('/register',viewsController.getRegisterPage);
router.get('/cart',viewsController.getCartPage);

module.exports = router;