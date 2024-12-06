import { adminLogin } from "@/controllers/adminController";
import { limiter } from "@/middleware/rateLimit";
import { authLoginValidation } from "@/middleware/validation";
import { Router } from "express";

const adminRouter = Router()
adminRouter.post('/login', authLoginValidation, limiter, adminLogin)

export default adminRouter