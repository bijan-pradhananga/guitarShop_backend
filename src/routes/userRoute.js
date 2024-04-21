const express = require('express')
const User = require('../controllers/userController')
const uInstance = new User()
const userRouter = express.Router()

userRouter.get('/', uInstance.index);
userRouter.post('/', uInstance.store);
userRouter.get('/:id', uInstance.show);
userRouter.put('/:id', uInstance.update);
userRouter.delete('/:id', uInstance.destroy);

module.exports =  userRouter;