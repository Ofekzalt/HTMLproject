const express = require("express");
const router = express.Router();

const checkAdmin = require('../middlewares/checkAdmin');
const viewsController = require('../controllers/viewControllers');
router.get('/about',checkAdmin,viewsController.getAboutPage);


module.exports = router;