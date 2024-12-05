import { Router } from 'express'
import { userRegister, userLogin } from '@/controllers/customerController'
import { authCustomerValidation, authCustomerLoginValidation } from '@/middleware/validation'
import { limiter } from '@/middleware/rateLimit'

const userRouter = Router()

userRouter.post('/register', authCustomerValidation, limiter, userRegister)
userRouter.post('/login', authCustomerLoginValidation, limiter, userLogin)

export default userRouter