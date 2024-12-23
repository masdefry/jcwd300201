import { createContactMessage, getContactMessage } from "@/controllers/contactController";
import { limiter } from "@/middleware/rateLimit";
import { roleCheckCustomer, roleCheckSuperAdmin } from "@/middleware/roleCheck";
import { createContactValidation } from "@/middleware/validation";
import { expressValidatorErrorHandling } from "@/middleware/validation/errorHandlingValidator";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const contactRouter = Router()
contactRouter.get('/', tokenValidation, roleCheckSuperAdmin, getContactMessage)
contactRouter.post('/', tokenValidation, roleCheckCustomer, limiter, createContactValidation, expressValidatorErrorHandling, createContactMessage)

export default contactRouter