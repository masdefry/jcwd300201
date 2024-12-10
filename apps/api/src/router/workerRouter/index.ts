import { Router } from 'express'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'
import { expressValidatorErrorHandling } from '@/middleware/validation/errorHandlingValidator'
import { getOrdersForDriverOutlet, getOrdersForDriverProccess, getOrdersForDriverWait } from '@/controllers/workerController'

const workerRouter = Router()

workerRouter.get('/order-wait', tokenValidation, getOrdersForDriverWait)
workerRouter.get('/order-process', tokenValidation, getOrdersForDriverProccess)
workerRouter.get('/order-outlet', tokenValidation, getOrdersForDriverOutlet)

export default workerRouter