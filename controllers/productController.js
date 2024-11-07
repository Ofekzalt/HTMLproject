const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

module.exports = {
    getAllProducts: (req, res) => {
        Product.find().populate('category', 'title')
            .then((products) => {
                res.status(200).json({ products });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message || 'An error occurred' });
            });
    },

    createProduct: async (req, res) => {
        try {
            console.log(req.file);  // Debugging to ensure the file is available
            const { path: image } = req.file;
            const { title, sizes, caption, price, category, color } = req.body;
    
            // Basic validation for the required fields
            if (!title || !sizes || !caption || !price || !category || !color) {
                return res.status(400).json({ message: 'All fields are required.' });
            }
    
            // // Check if category exists
            // Category.findById(category)
            //     .then((category) => {
                    if (!category) {
                        return res.status(404).json({ message: 'Category not found.' });
                    }
    
                    // Create the new product
                    const product = new Product({
                        // _id: new mongoose.Types.ObjectId(),
                        title,
                        image: image.replace('\\', '/'), 
                        sizes,
                        caption,
                        price,
                        color,
                        category
                    });
    
                    // Save the product to the database
                    await product.save();
                // })   
                    return res.status(201).json({ message: 'Created new product.' });

                // .then((savedProduct) => {
                //     // Successfully created the product, respond with the product data
                // })
                // .catch((error) => {
                //     // Handle errors: file issues, database errors, etc.
                //     console.error(error);
                //     res.status(500).json({ error: error.message || 'An error occurred while creating the product.' });
                // });
        } catch (error) {
            // Catch unexpected errors in the controller
            console.error(error);
            res.status(500).json({ error: error.message || 'Something went wrong' });
        }
    },

    getProduct: (req, res) => {
        const productId = req.params.productId;
        console.log(`Received request for product ID: ${productId}`);

        Product.findById(productId)
            .then((product) => {
                if (!product) {
                    console.log(`Product not found for ID: ${productId}`);
                    return res.status(404).json({ error: 'Product not found' });
                }
                console.log(`Product found: ${product}`);
                res.status(200).json({ product });
            })
            .catch((error) => {
                console.error('Error fetching product:', error);
                res.status(500).json({ error: error.message || 'An error occurred while retrieving the product.' });
            });
    },

    updateProduct: (req, res) => {
        const productId = req.params.productId;
        const { category } = req.body;

        Product.findById(productId)
            .then((product) => {
                if (!product) {
                    return res.status(404).json({ message: 'Product not found.' });
                }

                if (category) {
                    return Category.findById(category)
                        .then((category) => {
                            if (!category) {
                                return res.status(404).json({ message: 'Category not found.' });
                            }
                            return Product.updateOne({ _id: productId }, req.body);
                        })
                        .then(() => {
                            res.status(200).json({ message: 'Product updated.' });
                        });
                }

                return Product.updateOne({ _id: productId }, req.body).then(() => {
                    res.status(200).json({ message: 'Product updated.' });
                });
            })
            .catch((error) => {
                res.status(500).json({ error: error.message || 'An error occurred' });
            });
    },

   
    
    deleteProduct: (req, res) => {
        const productId = req.params.productId;
    
        Product.findById(productId)
            .then((product) => {
                if (!product) {
                    return res.status(404).json({
                        message: 'Product not found.'
                    });
                }
    
                // Assuming `product.image` holds the image path (like 'uploads/filename.jpg')
                const imagePath = path.join(__dirname, '../', product.image);
    
                // Delete the product from the database
                return Product.deleteOne({ _id: productId }).then((result) => {
                    if (result.deletedCount > 0) {
                        // Delete the image file
                        fs.unlink(imagePath, (err) => {
                            if (err) {
                                console.error('Error deleting image file:', err);
                            } else {
                                console.log('Image file deleted successfully');
                            }
                        });
    
                        return res.status(200).json({
                            message: `Product with _id: ${productId} and its image were deleted successfully.`
                        });
                    } else {
                        return res.status(404).json({
                            message: `Product with _id: ${productId} not found during deletion.`
                        });
                    }
                });
            })
            .catch((error) => {
                res.status(500).json({
                    error: error.message || 'An error occurred while deleting the product.'
                });
            });
    }
};