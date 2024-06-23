const Cart = require("../models/Cart");

class CartController {
    async addToCart(req, res) {
        try {
            const { product_id, user_id } = req.body;
            const existingCartItem = await Cart.findOne({ product_id, user_id });

            if (existingCartItem) {
                existingCartItem.quantity += 1;
                await existingCartItem.save();
                return res.status(200).json({ message: 'Cart updated successfully' });
            } else {
                await Cart.create({ product_id, user_id });
                return res.status(201).json({ success:true, message: 'Product added to cart successfully' });
            }
        } catch (err) {
            if (!res.headersSent) {
                res.status(500).json({ message: err.message });
            }
        }
    }

    async removeFromCart(req, res) {
        try {
            const { product_id, user_id } = req.body;
            await Cart.findOneAndDelete({ product_id, user_id });
            return res.status(200).json({ success:true, message: 'Product removed from cart successfully' });
        } catch (err) {
            if (!res.headersSent) {
                res.status(500).json({ message: err.message });
            }
        }
    }

    async getCartItems(req, res) {
        try {
            const { user_id } = req.params;
            const cartItems = await Cart.find({ user_id }).populate('product_id');
            return res.status(200).json(cartItems);
        } catch (err) {
            if (!res.headersSent) {
                res.status(500).json({ success:true, message: err.message });
            }
        }
    }
}

module.exports = CartController;

