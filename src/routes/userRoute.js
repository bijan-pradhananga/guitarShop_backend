const express = require('express')
const User = require('../controllers/userController')
const UploadMiddleware = require('../middleware/UploadMiddleware')
const uInstance = new User()
const userRouter = express.Router()
const fInstance = new UploadMiddleware();
const upload = fInstance.upload('users');

userRouter.get('/', uInstance.index);
userRouter.post('/',upload.single('image'), uInstance.store);
userRouter.get('/:id', uInstance.show);
userRouter.put('/:id', uInstance.update);
userRouter.delete('/:id', uInstance.destroy);

module.exports =  userRouter;