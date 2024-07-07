const express = require('express');
const Wishlist = require('../controllers/wishlistController');
const checkAuth = require('../middleware/AuthMiddleware');
const wishListRouter = express.Router();
const wishListInstance = new Wishlist();

wishListRouter.post('/',checkAuth, wishListInstance.addToWishlist);
wishListRouter.get('/:user_id',checkAuth, wishListInstance.getWishlistItems);
wishListRouter.delete('/',checkAuth, wishListInstance.removeFromWishlist);

module.exports =  wishListRouter;