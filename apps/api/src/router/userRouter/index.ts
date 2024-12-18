import { Router } from 'express'
import { userRegister, userLogin, userLogout, signInWithGoogle, userCreateAddress, getAllUserAddresses, getUserMainAddress, resendSetPassword, setPasswordUser, forgotPasswordUser, getSingleDataUser, updateProfileUser, changePasswordUser, deleteProfilePictureUser, changePasswordGoogleRegister, userEditAddress, getSingleAddressUser } from '@/controllers/userController'
import { authCustomerValidation, authLoginValidation, changePasswordGoogleValidation, changePasswordUserValidation, forgotPasswordUserValidation, resendSetPasswordValidation, setPasswordValidation, updateProfileUserValidation } from '@/middleware/validation'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'
import { expressValidatorErrorHandling } from '@/middleware/validation/errorHandlingValidator'
import { uploader } from '@/middleware/uploader'

const userRouter = Router()

// authenticate
userRouter.post('/register', authCustomerValidation, expressValidatorErrorHandling, limiter, userRegister)
userRouter.post('/login', authLoginValidation, expressValidatorErrorHandling, limiter, userLogin)
userRouter.post('/sign-w-google', limiter, signInWithGoogle)
userRouter.post('/logout', tokenValidation, limiter, userLogout)
userRouter.post('/set-password', tokenValidation, setPasswordValidation, expressValidatorErrorHandling, limiter, setPasswordUser)
userRouter.post('/forgot-password', forgotPasswordUserValidation, expressValidatorErrorHandling, limiter, forgotPasswordUser)
userRouter.post('/resend-password', resendSetPasswordValidation, expressValidatorErrorHandling, limiter, resendSetPassword)
userRouter.patch('/change-password', tokenValidation, limiter, changePasswordUserValidation, expressValidatorErrorHandling, changePasswordUser)
userRouter.patch('/change-password-google', tokenValidation, limiter, changePasswordGoogleValidation, expressValidatorErrorHandling, changePasswordGoogleRegister)
userRouter.patch('/profile', tokenValidation, uploader, limiter, updateProfileUserValidation, expressValidatorErrorHandling, updateProfileUser)

// address user
userRouter.post('/address', tokenValidation, limiter, userCreateAddress)
userRouter.get('/all-address', tokenValidation, getAllUserAddresses) // ganti addresses
userRouter.get('/main-address', tokenValidation, getUserMainAddress)
userRouter.get('/address/:id', tokenValidation, getSingleAddressUser)
userRouter.patch('/address/:addressId', tokenValidation, limiter, userEditAddress)
userRouter.get('/', tokenValidation, getSingleDataUser)
userRouter.delete('/', tokenValidation, deleteProfilePictureUser)

export default userRouter