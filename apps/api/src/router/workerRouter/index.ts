import { Router } from 'express'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'
import { expressValidatorErrorHandling } from '@/middleware/validation/errorHandlingValidator'
import { acceptOrder, createOrder, getItemName, getOrderNote, getOrderNoteDetail, getOrdersForDriver } from '@/controllers/workerController'
import { roleCheckSuperAdmin } from '@/middleware/roleCheck'

const workerRouter = Router()

workerRouter.get('/order', tokenValidation, getOrdersForDriver)
workerRouter.post('/accept-order/:orderId', tokenValidation, acceptOrder)
workerRouter.get('/get-order-note/', tokenValidation, getOrderNote)
workerRouter.get('/detail-order-note/:id', tokenValidation, getOrderNoteDetail)
workerRouter.get('/item-name', tokenValidation, getItemName)
workerRouter.post('/order/:orderId', tokenValidation, createOrder)

export default workerRouter