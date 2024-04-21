const express = require('express')
const categoryRouter = require('./categoryRouter')
const productRouter = require('./productRoute')
const userRouter = require('./userRoute')
const cartRouter = require('./cartRouter')
const ratingRouter = require('./ratingRouter')
const router = express.Router()

router.use('/user',userRouter)
router.use('/category',categoryRouter)
router.use('/product',productRouter)
router.use('/cart',cartRouter)
router.use('/rating',ratingRouter)


module.exports = router