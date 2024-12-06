import { requestPickUp } from "@/controllers/orderController";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const orderRouter = Router()
orderRouter.post('/keep-auth-user', tokenValidation, requestPickUp)

export default orderRouter