const express = require('express')
const categoryRouter = require('./categoryRouter')
const brandRouter = require('./brandRoute')
const productRouter = require('./productRoute')
const userRouter = require('./userRoute')
const cartRouter = require('./cartRouter')
const orderRouter = require('./orderRouter')
const authRouter = require('./authRoute')
const wishlistRouter = require('./wishlistRoute')
const adminRouter = require('./adminRoute')
const router = express.Router()

router.use('/user',userRouter)
router.use('/admin',adminRouter)
router.use('/category',categoryRouter)
router.use('/order',orderRouter)
router.use('/brand',brandRouter)
router.use('/product',productRouter)
router.use('/cart',cartRouter)
router.use('/auth',authRouter)
router.use('/wishlist',wishlistRouter)


module.exports = router