import { Router } from 'express'
import { limiter } from '@/middleware/rateLimit'
import { tokenValidation } from '@/middleware/verifyToken'
import { expressValidatorErrorHandling } from '@/middleware/validation/errorHandlingValidator'
import { changePasswordWorker, deleteProfilePictureWorker, updateProfileWorker, getAllWorker, getSingleDataWorker, getSingleWorkerById, deleteDataWorkerById } from '@/controllers/workerController'
import { roleCheckSuperAdmin } from '@/middleware/roleCheck'
import { changePasswordWorkerValidation, updateProfileWorkerValidation } from '@/middleware/validation'
import { uploader } from '@/middleware/uploader'

const workerRouter = Router()

workerRouter.get('/', tokenValidation, getSingleDataWorker)
workerRouter.patch('/profile', tokenValidation, uploader, limiter, updateProfileWorkerValidation, expressValidatorErrorHandling, updateProfileWorker)
workerRouter.patch('/change-password', tokenValidation, limiter, changePasswordWorkerValidation, expressValidatorErrorHandling, changePasswordWorker)
workerRouter.delete('/', tokenValidation, deleteProfilePictureWorker)

workerRouter.get('/all-workers', getAllWorker)
workerRouter.get('/detail/:id', getSingleWorkerById)
workerRouter.delete('/detail/:id', tokenValidation, roleCheckSuperAdmin, limiter, deleteDataWorkerById)

export default workerRouter