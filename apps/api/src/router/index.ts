import { Router } from "express";
import userRouter from "@/router/userRouter"
import authRouter from "./authRouter";
import adminRouter from "./adminRouter";
import orderRouter from "./orderRouter";

const router = Router()

router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/admin', adminRouter)
router.use('/order', orderRouter)


export default router