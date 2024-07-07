const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    product_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,
    },
    user_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    quantity: {
        type: Number,
        min: 1 // Minimum quantity allowed (cannot be less than 1)
    }
})

module.exports = mongoose.model('Cart',cartSchema)