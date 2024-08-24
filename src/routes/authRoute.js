const express = require('express')
const {registerController,loginController, isAuthenticated , logoutController,adminLoginController, adminLogoutController,isAdminAuthenticated} = require('../controllers/authController')
const authRouter = express.Router()
const UploadMiddleware = require('../middleware/UploadMiddleware')
const fInstance = new UploadMiddleware();
const upload = fInstance.upload('users');

authRouter.post('/login',loginController)
authRouter.post('/register',upload.single('image'),registerController)
authRouter.get('/user',isAuthenticated )
authRouter.post('/logout',logoutController)
authRouter.post('/adminLogin',adminLoginController)
authRouter.post('/adminLogout',adminLogoutController)
authRouter.get('/admin',isAdminAuthenticated)

module.exports = authRouter