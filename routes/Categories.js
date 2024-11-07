const express = require("express");
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const checkAdmin = require('../middlewares/checkAdmin');
const checkAuth= require('../middlewares/checkAuth');

//PUBLIC
router.get('/', categoryController.getAllCategories);
router.get('/:categoryId', categoryController.getCategory);
//PRIVATE
router.post('/', checkAuth, checkAdmin, categoryController.createCategory);
router.patch('/:categoryId',checkAuth, checkAdmin,categoryController.updateCategory);
router.delete('/:categoryId',checkAuth, checkAdmin, categoryController.deleteCategory);

module.exports = router;