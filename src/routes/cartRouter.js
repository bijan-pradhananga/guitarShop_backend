const express = require('express');
const Cart = require('../controllers/cartController');
const checkAuth = require('../middleware/AuthMiddleware');
const cartRouter = express.Router();
const cartInstance = new Cart();

cartRouter.post('/',checkAuth, cartInstance.addToCart);
cartRouter.get('/:user_id',checkAuth, cartInstance.getCartItems);
cartRouter.delete('/',checkAuth, cartInstance.removeFromCart);

module.exports =  cartRouter;