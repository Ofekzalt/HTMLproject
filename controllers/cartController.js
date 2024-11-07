const Cart = require("../models/Cart");
const Product = require("../models/Product");

module.exports = {
    getCart: async (req, res) => {
        try {
            const cart = await Cart.findOne({ user: req.user.id }).populate('products.product');
            if (!cart) {
                return res.status(404).json({ message: "Cart not found." });
            }

            // Calculate total price
            const totalPrice = cart.products.reduce((total, item) => {
                return total + item.product.price * item.quantity;
            }, 0);

            res.status(200).json({ cart, totalPrice });
        } catch (error) {
            console.error("Get cart error:", error);
            res.status(500).json({ message: "An error occurred while retrieving the cart." });
        }
    },

   
    addToCart: async (req, res) => {
        const { productId, size } = req.body;
        try {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }

            // Check if the size is available
            if (!product.sizes.includes(size)) {
                return res.status(400).json({ message: "Selected size is not available." });
            }

            let cart = await Cart.findOne({ user: req.user.id });

            if (!cart) {
                cart = new Cart({ user: req.user.id, products: [] });
            }

            // Check if the product with the specified size already exists in the cart
            const productIndex = cart.products.findIndex(p => 
                p.product.toString() === productId && p.size === size 
            );

            // If the product already exists in the cart with the same size
            if (productIndex > -1) {
                return res.status(400).json({ message: "This size of the product is already in the cart." });
            } else {
                // Push the new product with size into the cart and remove size from product
                cart.products.push({ product: productId, quantity: 1, size });
                product.sizes = product.sizes.filter(s => s !== size); // Remove size from available sizes
                await product.save();
            }

            await cart.save();
            res.status(200).json(cart);
        } catch (error) {
            console.error("Add to cart error:", error);
            res.status(500).json({ message: "An error occurred while adding to the cart." });
        }
    },
    removeFromCart: async (req, res) => {
        const { productId, size } = req.params;
        try {
            const cart = await Cart.findOne({ user: req.user.id });

            if (!cart) {
                return res.status(404).json({ message: "Cart not found." });
            }

            // Check if the product exists in the cart with the specified size
            const productIndex = cart.products.findIndex(p => 
                p.product.toString() === productId && p.size === size 
            );

            if (productIndex === -1) {
                return res.status(404).json({ message: "Product not found in the cart." });
            }

            // Remove the product from the cart
            const removedProduct = cart.products[productIndex];
            cart.products.splice(productIndex, 1);

            // Restore the size to the product
            const product = await Product.findById(productId);
            if (product) {
                // Check if size already exists before adding it back
                if (!product.sizes.includes(size)) {
                    product.sizes.push(size); // Restore the size
                    await product.save();
                }
            }

            await cart.save();
            res.status(200).json(cart);
        } catch (error) {
            console.error("Remove from cart error:", error);
            res.status(500).json({ message: "An error occurred while removing from the cart." });
        }
    },

    // clearCart: async (req, res) => {
    //     try {
    //         const cart = await Cart.findOne({ user: req.user.id });
    //         if (!cart) {
    //             return res.status(404).json({ message: "Cart not found." });
    //         }

    //         // Loop through each product in the cart and restore the sizes
    //         for (const item of cart.products) {
    //             const product = await Product.findById(item.product);
    //             if (product) {
    //                 // Only restore the size if it doesn't already exist
    //                 if (!product.sizes.includes(item.size)) {
    //                     product.sizes.push(item.size); // Restore the size
    //                     await product.save();
    //                 }
    //             }
    //         }

    //         // Clear the cart
    //         await Cart.findOneAndDelete({ user: req.user.id });
    //         res.status(200).json({ message: "Cart cleared." });
    //     } catch (error) {
    //         console.error("Clear cart error:", error);
    //         res.status(500).json({ message: "An error occurred while clearing the cart." });
    //     }
    // }
};