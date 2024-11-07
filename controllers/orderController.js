const Order = require("../models/Order");
const Cart = require("../models/Cart");

module.exports = {
    createOrder: async (req, res) => {
        try {
            const cart = await Cart.findOne({ user: req.user.id });

            if (!cart || cart.products.length === 0) {
                return res.status(400).json({ message: "Cart is empty." });
            }

            const totalPrice = cart.products.reduce((total, item) => {
                return total + (item.quantity * item.product.price);
            }, 0);

            const order = new Order({
                user: req.user.id,
                products: cart.products,
                totalPrice,
            });

            await order.save();
            await Cart.findOneAndDelete({ user: req.user.id });

            res.status(201).json(order);
        } catch (error) {
            console.error("Create order error:", error);
            res.status(500).json({ message: "An error occurred while creating the order." });
        }
    },

    getOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.orderId).populate('products.product');

            if (!order) {
                return res.status(404).json({ message: "Order not found." });
            }
            res.status(200).json(order);
        } catch (error) {
            console.error("Get order error:", error);
            res.status(500).json({ message: "An error occurred while retrieving the order." });
        }
    },

    getUserOrders: async (req, res) => {
        try {
            const orders = await Order.find({ user: req.user.id }).populate('products.product');
            res.status(200).json(orders);
        } catch (error) {
            console.error("Get user orders error:", error);
            res.status(500).json({ message: "An error occurred while retrieving orders." });
        }
    },

    deleteOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.orderId);

            if (!order) {
                return res.status(404).json({ message: "Order not found." });
            }

            await order.deleteOne();
            res.status(200).json({ message: "Order successfully deleted." });
        } catch (error) {
            console.error("Delete order error:", error);
            res.status(500).json({ message: "An error occurred while deleting the order." });
        }
    }
};