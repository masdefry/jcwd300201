
import { handleMidtransNotification } from "@/controllers/midtransController";
import { Router } from "express";

const midtransRouter = Router()

midtransRouter.post('/midtrans', handleMidtransNotification)

export default midtransRouter