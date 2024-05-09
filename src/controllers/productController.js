const Product = require("../models/Product");
const Rating = require("../models/Review");
class ProductController {
    async index(req, res) {
        try {
            // Extract pagination parameters from query string
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 4;
            let skip = (page - 1) * limit;
    
            let productsQuery =  Product.find().populate('category_id');
    
            // Check if category filter is provided in the query
            if (req.query.category) {
                let categoryIds = req.query.category.split(','); // Split category IDs
                productsQuery =  productsQuery.where('category_id').in(categoryIds);
            }
          
            // Check if price range filter is provided in the query
            if (req.query.minPrice && req.query.maxPrice) {
                productsQuery =  productsQuery.where('price').gte(req.query.minPrice).lte(req.query.maxPrice);
            }
    
            // Execute the query to find filtered products
            let filteredProducts = await productsQuery;
    
            // Calculate total number of filtered products
            let total = filteredProducts.length;
    
            // Calculate total number of pages
            let totalPages = Math.ceil(total / limit);
    
            // Check if sort parameter is provided in the query
            if (req.query.sort && req.query.sort !== 'def') {
                // Determine sorting order based on query parameter (default to ascending)
                let sortDirection = req.query.sort === 'desc' ? -1 : 1;
                // Add sorting by price to the filtered products
                filteredProducts.sort((a, b) => (a.price - b.price) * sortDirection);
            }
    
            // Apply pagination
            let paginatedProducts = filteredProducts.slice(skip, skip + limit);
    
            res.status(200).json({ products: paginatedProducts, total, totalPages });
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
            const product = await Product.findById(req.params.id).populate('category_id');
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

    async getProductByRating(req, res) {
        try {
            const products = await Product.find().sort({ rating: -1 }).limit(4);
            if (products) {
                res.status(200).json(products);
            }else{
                res.status(404).json({msg:'no products found'})
            }
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = ProductController;
