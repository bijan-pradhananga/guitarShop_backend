const express = require('express')
const Rating = require('../controllers/ratingController');
const ratingRouter = express.Router();
const rInstance = new Rating();

ratingRouter.post('/', rInstance.addRating);
ratingRouter.get('/:product_id', rInstance.getRatingsByProduct);

module.exports =  ratingRouter;