const express = require("express");
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload');
const checkAdmin = require('../middlewares/checkAdmin');
const checkAuth = require('../middlewares/checkAuth');

const {
    getAllProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct
} = productController;

// PUBLIC ROUTES
router.get('/', getAllProducts);  // Get all products
router.get('/:productId', getProduct);  // Get a single product by ID

// PRIVATE ROUTES (only accessible to authenticated admins)
router.post('/', checkAuth, checkAdmin, upload.single('image'), createProduct);  // Create a new product
router.patch('/:productId', checkAuth, checkAdmin, updateProduct);  // Update a product
router.delete('/:productId', checkAuth, checkAdmin, deleteProduct);  // Delete a product

module.exports = router;