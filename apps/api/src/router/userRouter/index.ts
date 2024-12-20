import { Router } from 'express'
import { userCreateAddress, getAllUserAddresses, getUserMainAddress, resendSetPassword, setPasswordUser, forgotPasswordUser, getSingleDataUser, updateProfileUser, changePasswordUser, deleteProfilePictureUser, changePasswordGoogleRegister, userEditAddress, getSingleAddressUser, deleteUserAddress } from '@/controllers/userController'
import { authRegisterValidation, authLoginValidation, changePasswordGoogleValidation, changePasswordUserValidation, forgotPasswordUserValidation, resendSetPasswordValidation, setPasswordValidation, updateProfileUserValidation, formAddressValidation } from '@/middleware/validation'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'
import { expressValidatorErrorHandling } from '@/middleware/validation/errorHandlingValidator'
import { uploader } from '@/middleware/uploader'
import { roleCheckCustomer } from '@/middleware/roleCheck'

const userRouter = Router()

// authenticate
userRouter.post('/set-password', tokenValidation, roleCheckCustomer, setPasswordValidation, expressValidatorErrorHandling, limiter, setPasswordUser)
userRouter.post('/forgot-password', forgotPasswordUserValidation, expressValidatorErrorHandling, limiter, forgotPasswordUser)
userRouter.post('/resend-password', resendSetPasswordValidation, expressValidatorErrorHandling, limiter, resendSetPassword)
userRouter.patch('/change-password', tokenValidation, roleCheckCustomer, limiter, changePasswordUserValidation, expressValidatorErrorHandling, changePasswordUser)
userRouter.patch('/change-password-google', tokenValidation, roleCheckCustomer, limiter, changePasswordGoogleValidation, expressValidatorErrorHandling, changePasswordGoogleRegister)
userRouter.patch('/profile', tokenValidation, roleCheckCustomer, uploader, limiter, updateProfileUserValidation, expressValidatorErrorHandling, updateProfileUser)

// address user
userRouter.get('/', tokenValidation, getSingleDataUser)
userRouter.delete('/', tokenValidation, deleteProfilePictureUser)
userRouter.post('/address', tokenValidation, roleCheckCustomer, formAddressValidation, expressValidatorErrorHandling, limiter, userCreateAddress)
userRouter.get('/all-address', tokenValidation, getAllUserAddresses)
userRouter.get('/main-address', tokenValidation, getUserMainAddress)
userRouter.get('/address/:id', tokenValidation, getSingleAddressUser)
userRouter.patch('/address/:addressId', tokenValidation, roleCheckCustomer, formAddressValidation, expressValidatorErrorHandling, limiter, userEditAddress)
userRouter.delete('/address/:addressId', tokenValidation, roleCheckCustomer, limiter, deleteUserAddress)

export default userRouter