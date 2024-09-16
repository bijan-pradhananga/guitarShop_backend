const Cart = require("../models/Cart");
const Product = require("../models/Product")

class CartController {
    async addToCart(req, res) {
        try {
            const { product_id, user_id, quantity = 1 } = req.body;
            const existingCartItem = await Cart.findOne({ product_id, user_id });
            const product = await Product.findById(product_id);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            if (product.quantity <= 0) {
                return res.status(400).json({ success: false, message: 'Product is out of stock' });
            }

            if (existingCartItem) {
                existingCartItem.quantity += quantity;
                await existingCartItem.save();
            } else {
                await Cart.create({ product_id, user_id, quantity });
            }

            // Decrease the product quantity
            product.quantity -= quantity;
            await product.save();

            return res.status(200).json({ success: true, message: 'Product added to cart successfully' });
        } catch (err) {
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: err.message });
            }
        }
    }

    async removeFromCart(req, res) {
        try {
            const { product_id, user_id } = req.body;
            const cartItem = await Cart.findOneAndDelete({ product_id, user_id });

            if (!cartItem) {
                return res.status(404).json({ success: false, message: 'Cart item not found' });
            }

            // Increase the product quantity
            const product = await Product.findById(product_id);
            if (product) {
                product.quantity += cartItem.quantity;
                await product.save();
            }

            return res.status(200).json({ success: true, message: 'Product removed from cart successfully', product_id: product._id });
        } catch (err) {
            if (!res.headersSent) {
                res.status(500).json({ success: false, message: err.message });
            }
        }
    }

    async getCartItems(req, res) {
        try {
            const { user_id } = req.params;
            const cartItems = await Cart.find({ user_id }).populate({
                path: 'product_id',
                populate: {
                    path: 'category_id',
                    select: 'category_name'
                }
            });
            // Calculate the total price
            const total = cartItems.reduce((total, cartItem) => {
                return total + cartItem.product_id.price * cartItem.quantity;
            }, 0).toFixed(2);
            return res.status(200).json({ cartItems,total });
        } catch (err) {
            if (!res.headersSent) {
                res.status(500).json({ success: true, message: err.message });
            }
        }
    }
}

module.exports = CartController;

