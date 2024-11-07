const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, 
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        lowercase: true 
    },
    password: {
        type: String,
        required: true,
    },
    // firstName: {
    //     type: String,
    //     default: '', 
    // },
    // lastName: {
    //     type: String,
    //     default: '', 
    // },
    // shippingAddress: {
    //     address: { type: String, default: '' },
    //     city: { type: String, default: '' },
    //     postalCode: { type: String, default: '' },
    //     country: { type: String, default: '' },
    //     phoneNumber: { type: String, default: '' },
    // },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);