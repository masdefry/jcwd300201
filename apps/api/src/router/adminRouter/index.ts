import { adminLogin, adminLogout } from "@/controllers/adminController";
import { limiter } from "@/middleware/rateLimit";
import { authLoginValidation } from "@/middleware/validation";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const adminRouter = Router()
adminRouter.post('/login', authLoginValidation, limiter, adminLogin)
adminRouter.post('/logout', tokenValidation, limiter, adminLogout)

export default adminRouter