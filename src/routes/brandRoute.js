const express = require('express')
const Brand = require('../controllers/brandController');
const brandRouter = express.Router();
const bInstance = new Brand();

brandRouter.get('/', bInstance.index);
brandRouter.post('/', bInstance.store);
brandRouter.get('/:id', bInstance.show);
brandRouter.put('/:id', bInstance.update);
brandRouter.delete('/:id', bInstance.destroy);

module.exports =  brandRouter;