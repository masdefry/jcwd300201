import { userKeepAuth } from "@/controllers/authController";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const authRouter = Router()
authRouter.get('/keep-auth-user', tokenValidation, userKeepAuth)

export default authRouter