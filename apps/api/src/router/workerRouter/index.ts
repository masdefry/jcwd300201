import { Router } from 'express'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'
import { expressValidatorErrorHandling } from '@/middleware/validation/errorHandlingValidator'
import { acceptOrder, getItemName, getOrderNote, getOrderNoteDetail, getOrdersForDriverWait } from '@/controllers/workerController'

const workerRouter = Router()

workerRouter.get('/order', tokenValidation, getOrdersForDriverWait)
workerRouter.post('/accept-order/:orderId', tokenValidation, acceptOrder)
workerRouter.get('/get-order-note/', tokenValidation, getOrderNote)
workerRouter.get('/detail-order-note/:id', tokenValidation, getOrderNoteDetail)
workerRouter.get('/item-name', tokenValidation, getItemName)

export default workerRouter