const Cart = require("../models/Cart");

class CartController {
    async addToCart(req, res) {
        try {
            const { product_id, user_id } = req.body;
            // Check if the cart item already exists for the user
            const existingCartItem = await Cart.findOne({ product_id, user_id });

            if (existingCartItem) {
                // If the cart item already exists, increment the quantity
                existingCartItem.quantity += 1;
                await existingCartItem.save();
                res.status(200).json({ message: 'Cart updated successfully' });
            } else {
                // If the cart item doesn't exist, create a new one
                await Cart.create({ product_id, user_id });
                res.status(201).json({ message: 'Product added to cart successfully' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async removeFromCart(req, res) {
        try {
            const { product_id, user_id } = req.body;
            // Find and delete the cart item for the specified product and user
            await Cart.findOneAndDelete({ product_id, user_id });
            res.status(200).json({ message: 'Product removed from cart successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getCartItems(req, res) {
        try {
            const { user_id } = req.params;
            // Find all cart items for the specified user
            const cartItems = await Cart.find({ user_id }).populate('product_id');
            res.status(200).json(cartItems);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = CartController;
