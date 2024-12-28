import { Router } from "express";
import express from 'express'
import userRouter from "@/routes/userRouter"
import authRouter from "./authRouter";
import orderRouter from "./orderRouter";
import storeRouter from "./storeRouter";
import workerRouter from "./workerRouter";
import contactRouter from "./contactRouter";
import laundryRouter from "./laundryItemRouter";
import midtransRouter from "./midtransRouter";

const router = Router()

router.use('*/images', express.static('src/public/images'))

router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/order', orderRouter)
router.use('/store', storeRouter)
router.use('/worker', workerRouter)
router.use('/contact', contactRouter)
router.use('/laundry', laundryRouter)
router.use('/webhook', midtransRouter)


export default router