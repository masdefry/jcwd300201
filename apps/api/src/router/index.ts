import { Router } from "express";
import userRouter from "@/router/userRouter"

const router = Router()

router.use('/user', userRouter)

export default router