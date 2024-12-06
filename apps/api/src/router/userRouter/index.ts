import { Router } from 'express'
import { userRegister, userLogin, userLogout, signInWithGoogle, userCreateAddress } from '@/controllers/userController'
import { authCustomerValidation, authLoginValidation } from '@/middleware/validation'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'

const userRouter = Router()

userRouter.post('/register', authCustomerValidation, limiter, userRegister)
userRouter.post('/login', authLoginValidation, limiter, userLogin)
userRouter.post('/sign-w-google', authLoginValidation, limiter, signInWithGoogle)
userRouter.post('/logout', tokenValidation, limiter, userLogout)
userRouter.post('/add-address', tokenValidation, limiter, userCreateAddress)

export default userRouter