import { Router } from 'express'
import { userRegister, userLogin, userLogout, signInWithGoogle, userCreateAddress, getAllUserAddresses, getUserMainAddress, resendSetPassword, setPasswordUser, forgotPasswordUser } from '@/controllers/userController'
import { authCustomerValidation, authLoginValidation, forgotPasswordUserValidation, resendSetPasswordValidation, setPasswordValidation } from '@/middleware/validation'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'
import { expressValidatorErrorHandling } from '@/middleware/validation/errorHandlingValidator'

const userRouter = Router()

userRouter.post('/register', authCustomerValidation, expressValidatorErrorHandling, limiter, userRegister)
userRouter.post('/login', authLoginValidation, expressValidatorErrorHandling, limiter, userLogin)
userRouter.post('/sign-w-google', authLoginValidation, expressValidatorErrorHandling, limiter, signInWithGoogle)
userRouter.post('/logout', tokenValidation, limiter, userLogout)
userRouter.post('/address', tokenValidation, limiter, userCreateAddress)
userRouter.get('/all-address', tokenValidation, limiter, getAllUserAddresses)
userRouter.get('/main-address', tokenValidation, limiter, getUserMainAddress)
userRouter.post('/resend-password', resendSetPasswordValidation, expressValidatorErrorHandling, limiter, resendSetPassword)
userRouter.post('/set-password', tokenValidation, setPasswordValidation, expressValidatorErrorHandling, limiter, setPasswordUser)
userRouter.post('forgot-password', tokenValidation, forgotPasswordUserValidation, expressValidatorErrorHandling, limiter, forgotPasswordUser)

export default userRouter