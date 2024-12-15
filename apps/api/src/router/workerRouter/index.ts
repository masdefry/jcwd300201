import { Router } from 'express'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'
import { expressValidatorErrorHandling } from '@/middleware/validation/errorHandlingValidator'
import { acceptOrder, createOrder, getItemName, getOrderItemDetail, getOrderNote, getOrderNoteDetail, getOrdersForDriver, getOrdersForWashing, washingProcess, washingProcessDone } from '@/controllers/workerController'
import { roleCheckSuperAdmin } from '@/middleware/roleCheck'

const workerRouter = Router()

workerRouter.get('/order', tokenValidation, getOrdersForDriver)
workerRouter.post('/accept-order/:orderId', tokenValidation, acceptOrder)
workerRouter.get('/get-order-note/', tokenValidation, getOrderNote)
workerRouter.get('/detail-order-note/:id', tokenValidation, getOrderNoteDetail)
workerRouter.get('/item-name', tokenValidation, getItemName)
workerRouter.post('/order/:orderId', tokenValidation, createOrder)
workerRouter.get('/order-detail/:orderId', tokenValidation, getOrderItemDetail)
workerRouter.post('/washing-process/:orderId', tokenValidation, washingProcess)
workerRouter.post('/washing-done/:orderId', tokenValidation, washingProcessDone)

export default workerRouter