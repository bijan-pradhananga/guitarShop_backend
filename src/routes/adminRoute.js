const express = require('express')
const Admin = require('../controllers/adminController')
const UploadMiddleware = require('../middleware/UploadMiddleware')
const aInstance = new Admin()
const adminRouter = express.Router()
const fInstance = new UploadMiddleware();
const upload = fInstance.upload('admins');

adminRouter.get('/', aInstance.index);
adminRouter.post('/',upload.single('image'), aInstance.store);
adminRouter.get('/:id', aInstance.show);
adminRouter.put('/:id',upload.single('image'), aInstance.update);
adminRouter.delete('/:id', aInstance.destroy);

module.exports =  adminRouter;