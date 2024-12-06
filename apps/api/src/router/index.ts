import { Router } from "express";
import userRouter from "@/router/userRouter"
import authRouter from "./authRouter";

const router = Router()

router.use('/user', userRouter)
router.use('/auth', authRouter)

export default router