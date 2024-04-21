const Rating = require("../models/Rating");

class RatingController {
    async addRating(req, res) {
        try {
            const { product_id, user_id, rating } = req.body;
    
            // Check if the user has already rated the product
            const existingRating = await Rating.findOne({ product_id, user_id });
    
            if (existingRating) {
                // If the user has already rated the product, update the rating value and remove the comment
                existingRating.rating = rating;
                await existingRating.save();
                res.status(200).json({ message: 'Rating updated successfully', rating: existingRating });
            } else {
                // If the user has not rated the product, create a new rating
                const newRating = await Rating.create({ product_id, user_id, rating });
                res.status(201).json({ message: 'Rating added successfully', rating: newRating });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    

    async getRatingsByProduct(req, res) {
        try {
            const { product_id } = req.params;
            const ratings = await Rating.find({ product_id });
            //calculating average rating
            const count = ratings.length
            let total = 0;
            ratings.map((rate)=>{
                total+=rate.rating;
            })
            const averageRating = count > 0 ? total / count : 0;
            res.status(200).json({ratings,averageRating});
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = RatingController;
