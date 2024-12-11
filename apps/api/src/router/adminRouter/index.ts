import { adminLogin, adminLogout, createProductLaundry, createWorker, deleteDataProductLaundry, deleteDataWorker, getAllWorker, getItemName, getSingleWorker } from "@/controllers/adminController";
import { limiter } from "@/middleware/rateLimit";
import { roleCheckSuperAdmin } from "@/middleware/roleCheck";
import { authLoginValidation, createProductLaundryValidation, createWorkerValidation } from "@/middleware/validation";
import { expressValidatorErrorHandling } from "@/middleware/validation/errorHandlingValidator";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const adminRouter = Router()
adminRouter.get('/worker', getAllWorker)
adminRouter.get('/worker/detail/:id', getSingleWorker)
adminRouter.post('/login', authLoginValidation, expressValidatorErrorHandling, limiter, adminLogin)
adminRouter.post('/logout', tokenValidation, limiter, adminLogout)
adminRouter.post('/worker', tokenValidation, roleCheckSuperAdmin, limiter, createWorkerValidation, expressValidatorErrorHandling, createWorker)
adminRouter.delete('/worker/detail/:id', tokenValidation, roleCheckSuperAdmin, limiter, deleteDataWorker)
adminRouter.get('/worker/item', tokenValidation, roleCheckSuperAdmin, getItemName)
adminRouter.post('/worker/item', tokenValidation, roleCheckSuperAdmin, limiter, createProductLaundryValidation, createProductLaundry)
adminRouter.delete('/worker/item/:id', tokenValidation, roleCheckSuperAdmin, limiter, deleteDataProductLaundry)

export default adminRouter