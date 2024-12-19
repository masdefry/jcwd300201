import { workerRegisterByAdmin, signInWithGoogle, userKeepAuth, userLogin, userLogout, userRegister, workerLogin, workerLogout } from "@/controllers/authController";
import { limiter } from "@/middleware/rateLimit";
import { roleCheckSuperAdmin } from "@/middleware/roleCheck";
import { authLoginValidation, authRegisterValidation, createWorkerValidation } from "@/middleware/validation";
import { expressValidatorErrorHandling } from "@/middleware/validation/errorHandlingValidator";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const authRouter = Router()

/* user router */
authRouter.post('/user/login', authLoginValidation, expressValidatorErrorHandling, limiter, userLogin)
authRouter.post('/user/register', authRegisterValidation, expressValidatorErrorHandling, limiter, userRegister)
authRouter.post('/user/logout', tokenValidation, limiter, userLogout)
authRouter.post('/user/sign-w-google', limiter, signInWithGoogle)

/* admin router */
authRouter.post('/worker/login', authLoginValidation, expressValidatorErrorHandling, limiter, workerLogin)
authRouter.post('/worker/register',tokenValidation, roleCheckSuperAdmin, limiter, createWorkerValidation, expressValidatorErrorHandling, workerRegisterByAdmin)
authRouter.post('/worker/logout', tokenValidation, limiter, workerLogout)

/* keep auth */
authRouter.get('/keep-auth', tokenValidation, userKeepAuth)

export default authRouter