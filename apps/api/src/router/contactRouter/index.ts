import { createContactMessage } from "@/controllers/contactController";
import { limiter } from "@/middleware/rateLimit";
import { roleCheckCustomer } from "@/middleware/roleCheck";
import { createContactValidation } from "@/middleware/validation";
import { expressValidatorErrorHandling } from "@/middleware/validation/errorHandlingValidator";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const contactRouter = Router()
contactRouter.post('/', tokenValidation, roleCheckCustomer, limiter, createContactValidation, expressValidatorErrorHandling, createContactMessage)

export default contactRouter