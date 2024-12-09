import { Router } from "express";
import userRouter from "@/router/userRouter"
import authRouter from "./authRouter";
import adminRouter from "./adminRouter";
import orderRouter from "./orderRouter";
import storeRouter from "./storeRouter";
import workerRouter from "./workerRouter";

const router = Router()

router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/admin', adminRouter)
router.use('/order', orderRouter)
router.use('/store', storeRouter)
router.use('/worker', workerRouter)


export default router