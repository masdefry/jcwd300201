import { Router } from "express";
import userRouter from "@/router/userRouter"
import authRouter from "./authRouter";
import orderRouter from "./orderRouter";

const router = Router()

router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/order', orderRouter)

export default router