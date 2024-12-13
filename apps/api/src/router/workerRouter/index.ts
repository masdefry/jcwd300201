import { Router } from 'express'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'
import { expressValidatorErrorHandling } from '@/middleware/validation/errorHandlingValidator'
import { acceptOrder, changePasswordWorker, createOrder, deleteProfilePictureWorker, getOrderNote, getOrderNoteDetail, getOrdersForDriver, getSingleDataWorker, updateProfileWorker } from '@/controllers/workerController'
import { roleCheckSuperAdmin } from '@/middleware/roleCheck'
import { changePasswordWorkerValidation, updateProfileWorkerValidation } from '@/middleware/validation'
import { uploader } from '@/middleware/uploader'

const workerRouter = Router()

workerRouter.get('/order', tokenValidation, getOrdersForDriver)
workerRouter.post('/accept-order/:orderId', tokenValidation, acceptOrder)
workerRouter.get('/get-order-note/', tokenValidation, getOrderNote)
workerRouter.get('/detail-order-note/:id', tokenValidation, getOrderNoteDetail)
workerRouter.post('/order/:orderId', tokenValidation, createOrder)
workerRouter.patch('/profile', tokenValidation, uploader, limiter, updateProfileWorkerValidation, expressValidatorErrorHandling, updateProfileWorker)
workerRouter.get('/', tokenValidation, getSingleDataWorker)
workerRouter.patch('/change-password', tokenValidation, limiter, changePasswordWorkerValidation, expressValidatorErrorHandling, changePasswordWorker)
workerRouter.delete('/', tokenValidation, deleteProfilePictureWorker)

export default workerRouter