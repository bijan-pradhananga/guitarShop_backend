const { getEsewaPaymentHash, verifyEsewaPayment } = require("../helper/esewa");
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Product = require("../models/Product");

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
                total: totalPrice
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
                productId: paymentInfo.response.transaction_uuid,
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
            res.json({
                success: true,
                message: "Payment successful",
                paymentData,
            });
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