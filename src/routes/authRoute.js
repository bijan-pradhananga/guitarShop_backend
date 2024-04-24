const express = require('express')
const loginController = require('../controllers/authController')
const authRouter = express.Router()

authRouter.post('/',loginController)

module.exports = authRouter