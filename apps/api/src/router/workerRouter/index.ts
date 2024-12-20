import { Router } from 'express'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'
import { expressValidatorErrorHandling } from '@/middleware/validation/errorHandlingValidator'
import {  changePasswordWorker, deleteProfilePictureWorker, updateProfileWorker, getAllWorker, getSingleDataWorker, getSingleWorkerById, deleteDataWorkerById, getLaundryItems, deleteLaundryItems, updateLaundryItems, createLaundryItems } from '@/controllers/workerController'
import { roleCheckSuperAdmin } from '@/middleware/roleCheck'
import { changePasswordWorkerValidation, productLaundryValidation, updateProfileWorkerValidation } from '@/middleware/validation'
import { uploader } from '@/middleware/uploader'

const workerRouter = Router()

// laundryitem controller
// workerRouter.get('/item', tokenValidation, getListItem)

// order controller
// workerRouter.get('/order', tokenValidation, getOrdersForDriver)
// workerRouter.get('/order-washing', tokenValidation, getOrdersForWashing)
// workerRouter.get('/order-ironing', tokenValidation, getOrdersForIroning)
// workerRouter.get('/order-packing', tokenValidation, getOrdersForPacking)
// workerRouter.get('/order-notes', tokenValidation, getNotes)
// workerRouter.post('/accept-order/:orderId', tokenValidation, acceptOrder)
// di delete // workerRouter.get('/get-order-note/', tokenValidation, getOrderNote) // order-notes
// workerRouter.get('/detail-order-note/:id', tokenValidation, getOrderNoteDetail)
// workerRouter.post('/order/:orderId', tokenValidation, createOrder)
// workerRouter.get('/order-detail/:orderId', tokenValidation, getOrderItemDetail)
// workerRouter.post('/washing-process/:orderId', tokenValidation, washingProcess)
// workerRouter.post('/washing-done/:orderId', tokenValidation, washingProcessDone)
// workerRouter.post('/ironing-process/:orderId', tokenValidation, ironingProcess)
// workerRouter.post('/ironing-done/:orderId', tokenValidation, ironingProcessDone)
// workerRouter.post('/packing-process/:orderId', tokenValidation, packingProcess)
// workerRouter.post('/packing-done/:orderId', tokenValidation, packingProcessDone)
// workerRouter.get('/history-washing/', tokenValidation, getWashingHistory)
// workerRouter.get('/history-ironing/', tokenValidation, getIroningHistory)
// workerRouter.get('/history-packing/', tokenValidation, getPackingHistory)

/* core */
workerRouter.get('/', tokenValidation, getSingleDataWorker)
workerRouter.patch('/profile', tokenValidation, uploader, limiter, updateProfileWorkerValidation, expressValidatorErrorHandling, updateProfileWorker)
workerRouter.patch('/change-password', tokenValidation, limiter, changePasswordWorkerValidation, expressValidatorErrorHandling, changePasswordWorker)
workerRouter.delete('/', tokenValidation, deleteProfilePictureWorker)

/* super admin */
workerRouter.get('/all-workers', getAllWorker)
workerRouter.get('/detail/:id', getSingleWorkerById)
workerRouter.delete('/detail/:id', tokenValidation, roleCheckSuperAdmin, limiter, deleteDataWorkerById)
workerRouter.get('/laundry-items', tokenValidation, roleCheckSuperAdmin, getLaundryItems)
workerRouter.post('/laundry-items', tokenValidation, roleCheckSuperAdmin, limiter, productLaundryValidation, createLaundryItems)
workerRouter.delete('/laundry-items/:id', tokenValidation, roleCheckSuperAdmin, limiter, deleteLaundryItems)
workerRouter.patch('/laundry-items/:id', tokenValidation, roleCheckSuperAdmin, limiter, productLaundryValidation, updateLaundryItems)

export default workerRouter