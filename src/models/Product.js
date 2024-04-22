const mongoose = require('mongoose');
const reviewSchema = require('./Review')
const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    product_image: {
        type: String,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    reviews:[reviewSchema],
    rating:{
        type:Number,
        default:0
    },
    totalReviews:{
        type:Number,
        default:0
    }
},{timestamps:true});

module.exports = mongoose.model('Product', productSchema);;
