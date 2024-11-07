const mongoose = require('mongoose');
const Category = require('../models/Category');

module.exports = {
    getAllCategories: (req, res) => {
        Category.find()
            .then((categories) => {
                res.status(200).json({
                    categories
                });
            })
            .catch((error) => {
                res.status(500).json({
                    error: error.message || 'An error occurred'
                });
            });
    },
    createCategory: (req, res) => {
        const { id, title } = req.body; 
    
        const category = new Category({
            _id: new mongoose.Types.ObjectId(), 
            title,
        });
        
        category.save()
            .then(() => {
                res.status(200).json({
                    message: 'Created new category.'
                });
            })
            .catch(error => {
                res.status(500).json({
                    error: error.message || 'An error occurred.'
                });
            });
    },

    getCategory: (req, res) => {
        const categoryId = req.params.categoryId;
        console.log(`Received request for category ID: ${categoryId}`);
        
        Category.findById(categoryId) 
            .then((category) => {
                if (!category) {
                    console.log(`Category not found for ID: ${categoryId}`);
                    return res.status(404).json({ error: 'Category not found' });
                }
                console.log(`Category found: ${category}`);
                res.status(200).json({ category });
            })
            .catch((error) => {
                console.error('Error fetching category:', error);
                res.status(500).json({ error: error.message || 'An error occurred while retrieving the category.' });
            });
    },

    updateCategory: (req, res) => {
        const categoryId = req.params.categoryId;
        
        Category.findById(categoryId)
            .then((category) => {
                if (!category) {
                    return res.status(404).json({
                        message: 'Category not found.'
                    });
                }

                return Category.updateOne({ _id: categoryId }, req.body)
                    .then(() => {
                        res.status(200).json({
                            message: 'Category updated.'
                        });
                    });
            })
            .catch(error => {
                res.status(500).json({
                    error: error.message || 'An error occurred while updating the category.'
                });
            });
    },

    deleteCategory: (req, res) => {
        const categoryId = req.params.categoryId;

        Category.findById(categoryId)
            .then((category) => {
                if (!category) {
                    return res.status(404).json({
                        message: 'Category not found.'
                    });
                }

                return Category.deleteOne({ _id: categoryId })
                    .then((result) => {
                        res.status(200).json({
                            message: `Category with _id: ${categoryId} deleted.`
                        });
                    });
            })
            .catch(error => {
                res.status(500).json({
                    error: error.message || 'An error occurred while deleting the category.'
                });
            });
    }
};