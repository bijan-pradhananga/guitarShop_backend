const Wishlist = require('../models/Wishlist');  // Adjust the path to your Wishlist model
const Product = require('../models/Product');  // Adjust the path to your Product model

class WishlistController {
    // Add a product to the wishlist
    async addToWishlist(req, res) {
        const { product_id, user_id } = req.body;
        try {
            const existingProduct = await Wishlist.findOne({ product_id, user_id });
            if (existingProduct) {
                return res.status(400).json({ success: false, message: 'Product already in wishlist' });
            }

            const product = await Product.findById(product_id);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            const newWishlistItem = new Wishlist({ product_id, user_id });
            await newWishlistItem.save();

            res.status(200).json({ success: true, message: 'Product added to wishlist successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Get all products in the user's wishlist
    async getWishlistItems(req, res) {
        const { user_id } = req.params;
        try {
            const wishlistItems = await Wishlist.find({ user_id }).populate({
                path: 'product_id',
                populate: {
                    path: 'category_id',
                    select: 'category_name' 
                }
            });
            res.status(200).json({ success: true, data: wishlistItems });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Remove a product from the wishlist
    async removeFromWishlist(req, res) {
        const { product_id, user_id } = req.body;
        try {
            const wishlistItem = await Wishlist.findOneAndDelete({ product_id, user_id });

            if (!wishlistItem) {
                return res.status(404).json({ success: false, message: 'Product not found in wishlist' });
            }

            res.status(200).json({ success: true, message: 'Product removed from wishlist successfully',product_id});
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = WishlistController;
