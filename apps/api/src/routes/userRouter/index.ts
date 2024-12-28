import { Router } from 'express'
import { userCreateAddress, getAllUserAddresses, getUserMainAddress, getSingleDataUser, updateProfileUser, changePasswordUser, deleteProfilePictureUser, changePasswordGoogleRegister, userEditAddress, getSingleAddressUser, deleteUserAddress, changeMainAddressUser } from '@/controllers/userController'
import { changePasswordGoogleValidation, changePasswordUserValidation, updateProfileUserValidation, formAddressValidation } from '@/middlewares/validation'
import { limiter } from '@/middlewares/rateLimit'
import { tokenValidation } from '@/middlewares/verifyToken'
import { expressValidatorErrorHandling } from '@/middlewares/validation/errorHandlingValidator'
import { uploader } from '@/middlewares/uploader'
import { roleCheckCustomer } from '@/middlewares/roleCheck'

const userRouter = Router()

// authenticate

userRouter.patch('/change-password', tokenValidation, roleCheckCustomer, limiter, changePasswordUserValidation, expressValidatorErrorHandling, changePasswordUser)
userRouter.patch('/change-password-google', tokenValidation, roleCheckCustomer, limiter, changePasswordGoogleValidation, expressValidatorErrorHandling, changePasswordGoogleRegister)
userRouter.patch('/profile', tokenValidation, roleCheckCustomer, uploader, limiter, updateProfileUserValidation, expressValidatorErrorHandling, updateProfileUser)

// address user
userRouter.get('/', tokenValidation, getSingleDataUser)
userRouter.delete('/', tokenValidation, deleteProfilePictureUser)
userRouter.post('/address', tokenValidation, roleCheckCustomer, formAddressValidation, expressValidatorErrorHandling, limiter, userCreateAddress)
userRouter.get('/all-address', tokenValidation, getAllUserAddresses)
userRouter.get('/main-address', tokenValidation, getUserMainAddress)
userRouter.patch('/main-address/:id', tokenValidation, roleCheckCustomer, limiter, changeMainAddressUser)
userRouter.get('/address/:id', tokenValidation, getSingleAddressUser)
userRouter.patch('/address/:addressId', tokenValidation, roleCheckCustomer, formAddressValidation, expressValidatorErrorHandling, limiter, userEditAddress)
userRouter.delete('/address/:addressId', tokenValidation, roleCheckCustomer, limiter, deleteUserAddress)
export default userRouter