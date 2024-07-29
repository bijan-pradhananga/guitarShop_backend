const Product = require("../models/Product");
const Rating = require("../models/Review");
const fs = require('fs');
const path = require('path');

class ProductController {
    async index(req, res) {
        try {
            // Extract pagination parameters from query string
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 4;
            let skip = (page - 1) * limit;

            let productsQuery = Product.find()
                .populate('category_id')
                .populate('brand_id')
                .sort({ createdAt: -1 });

            // Check if category filter is provided in the query
            if (req.query.category) {
                let categoryIds = req.query.category.split(','); // Split category IDs
                productsQuery = productsQuery.where('category_id').in(categoryIds);
            }

            // Check if price range filter is provided in the query
            if (req.query.minPrice && req.query.maxPrice) {
                productsQuery = productsQuery.where('price').gte(req.query.minPrice).lte(req.query.maxPrice);
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
            if (paginatedProducts) {
                res.status(200).json({ products: paginatedProducts, total, totalPages });
            } else {
                res.status(404).json({ message: 'no such products found' });
            }

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }


    async store(req, res) {
        try {
            let product_image = "";
            if (req.file) {
                product_image = req.file.filename;
            }
            await Product.create({ ...req.body, product_image });
            res.status(201).json({ message: 'Product created successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async show(req, res) {
        try {
            const product = await Product.findById(req.params.id).populate('category_id').populate('brand_id');
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const productId = req.params.id;
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product Not Found' });
            }
            // Handle image upload if a file is present in the request
            if (req.file) {
                const oldImagePath = product.product_image ? path.join(__dirname, '../../public/products', product.product_image) : null;
                // Save the new image
                const imagePath = req.file.filename;
                // Update the product's image path in the database
                req.body.product_image = imagePath;
                // Delete the old image if it exists
                if (oldImagePath && fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            await Product.findByIdAndUpdate(productId, req.body, { new: true });
            res.status(200).json({ message: 'Product updated successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async destroy(req, res) {
        try {
            // Find the product by ID
            const product = await Product.findById(req.params.id);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Construct the image path
            const imagePath = product.product_image ? path.join(__dirname, '../../public/products', product.product_image) : null;

            // Delete the image file if it exists
            if (imagePath && fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            // Delete the product from the database
            await Product.findByIdAndDelete(req.params.id);

            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async search(req, res) {
        const { name } = req.query;
        try {
            // Use regex to perform case-insensitive search
            const products = await Product.find({ product_name: { $regex: name, $options: 'i' } }).limit(3).populate('category_id').populate('brand_id');
            if (products.length === 0) {
                return res.status(404).json({ success: false, message: 'No products found' });
            }
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async productReview(req, res) {
        try {
            const { comment, rating, user_id } = req.body
            const product = await Product.findById(req.params.id);
            //check if review exists
            const alreadyReviewed = product.reviews.find(
                review => review.user_id.toString() === user_id.toString()
            )
            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product Already Reviewed' })
            }
            const review = {
                rating: Number(rating), comment, user_id
            }
            product.reviews.push(review)
            product.totalReviews = product.reviews.length
            product.rating = product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.reviews.length;
            await product.save()
            res.status(200).json({ message: 'Review Added', product })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProductByRating(req, res) {
        try {
            const products = await Product.find().sort({ rating: -1 }).limit(4);
            if (products) {
                res.status(200).json(products);
            } else {
                res.status(404).json({ message: 'no products found' })
            }

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    
}

module.exports = ProductController;
