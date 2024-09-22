const { getEsewaPaymentHash, verifyEsewaPayment } = require("../helper/esewa");
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Product = require("../models/Product");
const Cart = require('../models/Cart');

class PaymentController {
    async initializePayment(req, res) {
        try {
            const { user_id, product_id, quantity } = req.body;
            // Fetch the product details
            const product = await Product.findById(product_id);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            const totalPrice = product.price * quantity;

            // Create a record for the purchase
            const items = [{
                product_id: product._id,
                quantity,
                price: product.price
            }];
            const order = new Order({
                user_id,
                items,
                payment: 'esewa',
                total: totalPrice,
                total_quantity: quantity
            });
            await order.save()
            // Decrease the product quantity and save
            product.quantity -= quantity;
            await product.save();

            // Initiate payment with eSewa
            const paymentInitiate = await getEsewaPaymentHash({
                amount: totalPrice,
                transaction_uuid: order._id,
            });

            // Respond with payment details
            res.json({
                success: true,
                payment: paymentInitiate,
                order: order,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    //for checkout
    async initializePayment2(req, res) {
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
            const total_quantity = items.reduce((sum, item) => sum + item.quantity, 0);
            const order = new Order({
                user_id,
                items,
                payment: 'esewa',
                total,
                total_quantity
            });
            await order.save();
            await Cart.deleteMany({ user_id });
            // Initiate payment with eSewa
            const paymentInitiate = await getEsewaPaymentHash({
                amount: total,
                transaction_uuid: order._id,
            });

            // Respond with payment details
            res.json({
                success: true,
                payment: paymentInitiate,
                order: order,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }

    async completePayment(req, res) {
        const { data } = req.query; // Data received from eSewa's redirect
        
        try {
            // Verify payment with eSewa
            const paymentInfo = await verifyEsewaPayment(data);

            // Find the purchased item using the transaction UUID
            const order = await Order.findById(
                paymentInfo.response.transaction_uuid
            );

            if (!order) {
                return res.status(500).json({
                    success: false,
                    message: "Purchase not found",
                });
            }


            // Create a new payment record in the database
            const paymentData = await Payment.create({
                pidx: paymentInfo.decodedData.transaction_code,
                transactionId: paymentInfo.decodedData.transaction_code,
                orderId: paymentInfo.response.transaction_uuid,
                amount: order.total,
                dataFromVerificationReq: paymentInfo,
                apiQueryFromUser: req.query,
                paymentGateway: "esewa",
                status: "success",
            });

            // Update the purchased item status to 'completed'
            await Order.findByIdAndUpdate(
                paymentInfo.response.transaction_uuid,
                { $set: { status: "Completed" } }
            );

            // Respond with success message
            // res.json({
            //     success: true,
            //     message: "Payment successful",
            //     paymentData,
            // });

            // Redirect to the frontend success page
            return res.redirect(`http://localhost:3000/payment/success?orderId=${order._id}`);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "An error occurred during payment verification",
                error: error.message,
            });
        }
    }
}

module.exports = PaymentController