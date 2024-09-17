const express = require('express')
const Payment = require('../controllers/paymentController');
const pInstance = new Payment()
const paymentRouter = express.Router()

paymentRouter.post('/initialize-esewa', pInstance.initializePayment);
paymentRouter.post('/initialize-esewa2', pInstance.initializePayment2);
paymentRouter.get('/complete-payment', pInstance.completePayment);

module.exports =  paymentRouter;