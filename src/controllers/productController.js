const Product = require("../models/Product");
const Rating = require("../models/Review");
class ProductController {
    async index(req, res) {
        try {
            // Extract pagination parameters from query string
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 4;
            let skip = (page - 1) * limit;
    
            // Find total number of products
            let total = await Product.countDocuments();
    
            // Calculate total number of pages
            let totalPages = Math.ceil(total / limit);

            let productsQuery = Product.find().skip(skip).limit(limit).populate('category_id');
    
            // Check if sort parameter is provided in the query
            if (req.query.sort) {
                // Determine sorting order based on query parameter (default to ascending)
                let sortDirection = req.query.sort === 'desc' ? -1 : 1;
                // Add sorting by price to the query
                productsQuery = productsQuery.sort({ price: sortDirection });
            }
    
            // Execute the query to find products
            let products = await productsQuery;
    
            res.status(200).json({ products, total, totalPages });
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
