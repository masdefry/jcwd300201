import { Router } from 'express'
import { limiter } from '@/middlewares/rateLimit'
import { tokenValidation } from '@/middlewares/verifyToken'
import { expressValidatorErrorHandling } from '@/middlewares/validation/errorHandlingValidator'
import { changePasswordWorker, deleteProfilePictureWorker, updateProfileWorker, getAllWorker, getSingleDataWorker, getSingleWorkerById, deleteDataWorkerById } from '@/controllers/workerController'
import { roleCheckSuperAdmin } from '@/middlewares/roleCheck'
import { changePasswordWorkerValidation, updateProfileWorkerValidation } from '@/middlewares/validation'
import { uploader } from '@/middlewares/uploader'

const workerRouter = Router()

workerRouter.get('/', tokenValidation, getSingleDataWorker)
workerRouter.patch('/profile', tokenValidation, uploader, limiter, updateProfileWorkerValidation, expressValidatorErrorHandling, updateProfileWorker)
workerRouter.patch('/change-password', tokenValidation, limiter, changePasswordWorkerValidation, expressValidatorErrorHandling, changePasswordWorker)
workerRouter.delete('/', tokenValidation, deleteProfilePictureWorker)

workerRouter.get('/all-workers', getAllWorker)
workerRouter.get('/detail/:id', getSingleWorkerById)
workerRouter.patch('/detail/:id', tokenValidation, roleCheckSuperAdmin, limiter, deleteDataWorkerById)

export default workerRouter