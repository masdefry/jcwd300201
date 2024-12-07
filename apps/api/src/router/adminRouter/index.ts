import { adminLogin, adminLogout, createWorker, getAllWorker } from "@/controllers/adminController";
import { limiter } from "@/middleware/rateLimit";
import { roleCheckSuperAdmin } from "@/middleware/roleCheck";
import { authLoginValidation, createWorkerValidation } from "@/middleware/validation";
import { expressValidatorErrorHandling } from "@/middleware/validation/errorHandlingValidator";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const adminRouter = Router()
adminRouter.get('/worker', getAllWorker)
adminRouter.post('/login', authLoginValidation, expressValidatorErrorHandling, limiter, adminLogin)
adminRouter.post('/logout', tokenValidation, limiter, adminLogout)
adminRouter.post('/c-worker', tokenValidation, roleCheckSuperAdmin, limiter, createWorkerValidation, expressValidatorErrorHandling, createWorker)

export default adminRouter