const express = require('express')
const categoryRouter = require('./categoryRouter')
const productRouter = require('./productRoute')
const userRouter = require('./userRoute')
const cartRouter = require('./cartRouter')
const authRouter = require('./authRoute')
const wishlistRouter = require('./wishlistRoute')
const router = express.Router()

router.use('/user',userRouter)
router.use('/category',categoryRouter)
router.use('/product',productRouter)
router.use('/cart',cartRouter)
router.use('/auth',authRouter)
router.use('/wishlist',wishlistRouter)

module.exports = router