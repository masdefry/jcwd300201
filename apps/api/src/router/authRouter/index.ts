import { workerRegisterByAdmin, signInWithGoogle, userKeepAuth, userLogin, userLogout, userRegister, workerLogin, workerLogout, setPasswordUser, resendEmailUser, resendEmailWorker, setPasswordWorker } from "@/controllers/authController";
import { limiter } from "@/middleware/rateLimit";
import { roleCheckSuperAdmin } from "@/middleware/roleCheck";
import { authLoginValidation, authRegisterValidation, createWorkerValidation, forgotPasswordUserValidation, resendSetPasswordValidation, setPasswordValidation } from "@/middleware/validation";
import { expressValidatorErrorHandling } from "@/middleware/validation/errorHandlingValidator";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const authRouter = Router()

/* user router */
authRouter.post('/user/login', authLoginValidation, expressValidatorErrorHandling, limiter, userLogin)
authRouter.post('/user/register', authRegisterValidation, expressValidatorErrorHandling, limiter, userRegister)
authRouter.post('/user/logout', tokenValidation, limiter, userLogout)
authRouter.post('/user/sign-w-google', limiter, signInWithGoogle)
authRouter.post('/user/set-password', tokenValidation, setPasswordValidation, expressValidatorErrorHandling, limiter, setPasswordUser)
authRouter.post('/user/resend-email', resendSetPasswordValidation, expressValidatorErrorHandling, limiter, resendEmailUser)

/* admin router */
authRouter.post('/worker/resend-email', forgotPasswordUserValidation, expressValidatorErrorHandling, limiter, resendEmailWorker)
authRouter.post('/worker/set-password', tokenValidation, setPasswordValidation, expressValidatorErrorHandling, limiter, setPasswordWorker)
authRouter.post('/worker/login', authLoginValidation, expressValidatorErrorHandling, limiter, workerLogin)
authRouter.post('/worker/register', tokenValidation, roleCheckSuperAdmin, limiter, createWorkerValidation, expressValidatorErrorHandling, workerRegisterByAdmin)
authRouter.post('/worker/logout', tokenValidation, limiter, workerLogout)

/* keep auth */
authRouter.get('/keep-auth', tokenValidation, userKeepAuth)

export default authRouter