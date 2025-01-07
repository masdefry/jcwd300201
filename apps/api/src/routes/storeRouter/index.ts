import { createStoreByAdmin, deleteStore, getAllStore, getSingleStore, getStore, updateStore } from "@/controllers/storeController";
import { limiter } from "@/middlewares/rateLimit";
import { roleCheckSuperAdmin } from "@/middlewares/roleCheck";
import { createOutletValidationSchema } from "@/middlewares/validation";
import { expressValidatorErrorHandling } from "@/middlewares/validation/errorHandlingValidator";
import { tokenValidation } from "@/middlewares/verifyToken";
import { Router } from "express";

const storeRouter = Router()

storeRouter.get('/', getStore)
storeRouter.post('/', tokenValidation, roleCheckSuperAdmin, limiter, createOutletValidationSchema, expressValidatorErrorHandling, createStoreByAdmin)
storeRouter.get('/stores', tokenValidation, roleCheckSuperAdmin, getAllStore)
storeRouter.get('/detail/:outletId', tokenValidation, roleCheckSuperAdmin, getSingleStore)
storeRouter.patch('/detail/:outletId', tokenValidation, roleCheckSuperAdmin, limiter, updateStore)
storeRouter.patch('/delete/:outletId', tokenValidation, roleCheckSuperAdmin, limiter, deleteStore)

export default storeRouter