const Product = require("../models/Product");
const Rating = require("../models/Review");
class ProductController {
        async index(req, res) {
            try {
                // Find all products and populate the category_id field
                let products = await Product.find().populate('category_id');
                res.status(200).json(products);
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        }

    async store(req, res) {
        try {
            await Product.create(req.body);
            res.status(201).json({ message: 'Product created successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async show(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            await Product.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ message: 'Product updated successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async destroy(req, res) {
        try {
            await Product.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async productReview(req,res){
        try {
            const {comment,rating,user_id} = req.body
            const product = await Product.findById(req.params.id);
            //check if review exists
            const alreadyReviewed = product.reviews.find(
                review=>review.user_id.toString()===user_id.toString()
            )
            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product Already Reviewed' })
            }
            const review = {
                rating:Number(rating),comment,user_id
            }
            product.reviews.push(review)
            product.totalReviews = product.reviews.length
            product.rating = product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.reviews.length;
            await product.save()
            res.status(200).json({message:'Review Added',product})
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = ProductController;
