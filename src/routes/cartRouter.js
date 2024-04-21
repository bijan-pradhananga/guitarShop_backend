const express = require('express');
const Cart = require('../controllers/cartController');
const cartRouter = express.Router();
const cartInstance = new Cart()

cartRouter.post('/', cartInstance.addToCart);
cartRouter.get('/:user_id', cartInstance.getCartItems);
cartRouter.delete('/', cartInstance.removeFromCart);

module.exports =  cartRouter;