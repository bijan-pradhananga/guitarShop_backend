const express = require('express')
const Category = require('../controllers/categoryController');
const categoryRouter = express.Router();
const cInstance = new Category();

categoryRouter.get('/', cInstance.index);
categoryRouter.post('/', cInstance.store);
categoryRouter.get('/:id', cInstance.show);
categoryRouter.put('/:id', cInstance.update);
categoryRouter.delete('/:id', cInstance.destroy);

module.exports =  categoryRouter;