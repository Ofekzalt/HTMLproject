const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        size: {
            type: Number, 
            required: true,
        },
    }],
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);