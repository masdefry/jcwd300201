import { Router } from 'express'
import { userRegister, userLogin, userLogout } from '@/controllers/userController'
import { authCustomerValidation, authCustomerLoginValidation } from '@/middleware/validation'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'

const userRouter = Router()

userRouter.post('/register', authCustomerValidation, limiter, userRegister)
userRouter.post('/login', authCustomerLoginValidation, limiter, userLogin)
userRouter.post('/logout', tokenValidation, limiter, userLogout)

export default userRouter