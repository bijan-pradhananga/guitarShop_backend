const Product = require("../models/Product");
const Rating = require("../models/Rating");
class ProductController {
        async index(req, res) {
            try {
                // Find all products and populate the category_id field
                let products = await Product.find().populate('category_id');
                let newProducts = products
                // Add a checking object to each product for testing
                newProducts.map(product => {
                    // console.log(product);
                    product.checking = 'test';
                });
    
                // Log the products array to see if the checking object is added
                console.log(newProducts);
    
                // Send the response with products
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
}

module.exports = ProductController;
