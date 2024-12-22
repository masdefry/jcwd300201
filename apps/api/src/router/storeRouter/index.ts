import { createStoreByAdmin, getAllStore, getStore } from "@/controllers/storeController";
import { limiter } from "@/middleware/rateLimit";
import { roleCheckSuperAdmin } from "@/middleware/roleCheck";
import { createOutletValidation } from "@/middleware/validation";
import { expressValidatorErrorHandling } from "@/middleware/validation/errorHandlingValidator";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const storeRouter = Router()

storeRouter.get('/', getStore)
storeRouter.post('/', tokenValidation, roleCheckSuperAdmin, limiter, createOutletValidation, expressValidatorErrorHandling, createStoreByAdmin)
storeRouter.get('/stores', tokenValidation, roleCheckSuperAdmin, getAllStore)

export default storeRouter