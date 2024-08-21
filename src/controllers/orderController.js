const Order = require("../models/Order");
const Cart = require('../models/Cart');
const Product = require("../models/Product");

class OrderController {
    async index(req, res) {
        try {
            // Extract pagination parameters from query string
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 6;
            let skip = (page - 1) * limit;

            const ordersQuery = await Order.find().populate({
                path: 'user_id',
                select: 'first_name last_name'
            }).populate({
                path: 'items.product_id',
                select: 'product_name price product_image'
            }).sort({ createdAt: -1 });
            // Execute the query to find filtered products
            let filteredOrders = await ordersQuery;

            // Calculate total number of filtered products
            let total = filteredOrders.length;

            // Calculate total number of pages
            let totalPages = Math.ceil(total / limit);
            // Apply pagination
            let paginatedOrders = filteredOrders.slice(skip, skip + limit);
            if (paginatedOrders) {
                res.status(200).json({success: true, orders: paginatedOrders, total, totalPages });
            } else {
                res.status(404).json({success: false, message: 'no such products found' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async checkout(req, res) {
        try {
            const { user_id } = req.body;
            const cartItems = await Cart.find({ user_id }).populate('product_id');
            if (cartItems.length === 0) {
                return res.status(400).json({ success: false, message: 'Cart is empty' });
            }
            const items = cartItems.map(item => ({
                product_id: item.product_id._id,
                quantity: item.quantity,
                price: item.product_id.price
            }));
            const total = items.reduce((total, item) => total + item.price * item.quantity, 0);
            const order = new Order({
                user_id,
                items,
                total
            });
            await order.save();
            await Cart.deleteMany({ user_id });
            return res.status(201).json({ success: true, message: 'Order Placed Successfully' });
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }

    async getUserOrders(req, res) {
        try {
            const orders = await Order.find({ user_id: req.params.id }).populate({
                path: 'items.product_id',
                select: 'product_name price product_image', // Select the fields you want to include
                // populate: {
                //     path: 'category_id',
                //     select: 'category_name', // Optionally populate the category details
                // }
            });
            if (orders.length > 0) {
                res.status(200).json({ success: true, orders });
            } else {
                res.status(404).json({ success: false, message: "No Orders Found" });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }


    async buyNow(req, res) {
        try {
            const { user_id, product_id, quantity } = req.body;
            // Fetch the product details
            const product = await Product.findById(product_id);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            // Check if there's enough stock
            if (product.quantity < quantity) {
                return res.status(400).json({ success: false, message: 'Not enough stock available' });
            }
            // Create the order
            const items = [{
                product_id: product._id,
                quantity,
                price: product.price
            }];
            const totalPrice = product.price * quantity;
            const order = new Order({
                user_id,
                items,
                total: totalPrice
            });
            await order.save();
            // Decrease the product quantity
            product.quantity -= quantity;
            await product.save();
            return res.status(201).json({ success: true, message: 'Order Placed Successfully' });
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }



}

module.exports = OrderController;