const express = require('express')
const Order = require('../controllers/orderController');
const orderRouter = express.Router();
const oInstance = new Order();

orderRouter.post('/', oInstance.buyNow);
orderRouter.get('/', oInstance.index);
orderRouter.put('/:id', oInstance.update);
orderRouter.put('/:id/cancel', oInstance.cancelOrder);
orderRouter.post('/checkout', oInstance.checkout);
orderRouter.get('/:id', oInstance.getUserOrders);

module.exports =  orderRouter;