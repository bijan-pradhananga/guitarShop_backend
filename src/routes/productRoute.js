const express = require('express')
const Product = require('../controllers/productController')
const pInstance = new Product()
const productRouter = express.Router()

productRouter.get('/', pInstance.index);
productRouter.post('/', pInstance.store);
productRouter.get('/:id', pInstance.show);
productRouter.put('/:id', pInstance.update);
productRouter.delete('/:id', pInstance.destroy);

module.exports =  productRouter;