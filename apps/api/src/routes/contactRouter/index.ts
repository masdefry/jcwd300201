import { createContactMessage, getContactMessage } from "@/controllers/contactController";
import { limiter } from "@/middlewares/rateLimit";
import { roleCheckCustomer, roleCheckSuperAdmin } from "@/middlewares/roleCheck";
import { createContactValidation } from "@/middlewares/validation";
import { expressValidatorErrorHandling } from "@/middlewares/validation/errorHandlingValidator";
import { tokenValidation } from "@/middlewares/verifyToken";
import { Router } from "express";

const contactRouter = Router()
contactRouter.get('/', tokenValidation, roleCheckSuperAdmin, getContactMessage)
contactRouter.post('/', tokenValidation, roleCheckCustomer, limiter, createContactValidation, expressValidatorErrorHandling, createContactMessage)

export default contactRouter