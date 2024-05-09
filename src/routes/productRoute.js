const express = require('express')
const Product = require('../controllers/productController')
const UploadMiddleware = require('../middleware/UploadMiddleware')
const pInstance = new Product()
const fInstance = new UploadMiddleware();
const upload = fInstance.upload('products');
const productRouter = express.Router()

productRouter.get('/', pInstance.index);
productRouter.post('/', upload.single('image'), pInstance.store);
productRouter.get('/top-rated', pInstance.getProductByRating);
productRouter.get('/:id', pInstance.show);
productRouter.put('/:id', pInstance.update);
productRouter.delete('/:id', pInstance.destroy);

productRouter.put('/:id/review',pInstance.productReview)

module.exports =  productRouter;