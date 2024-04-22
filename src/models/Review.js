const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        default:0,
        min: 0,
        max: 5
    },
    comment:{
        type:String
    }
},{timestamps:true});

module.exports = ratingSchema;
