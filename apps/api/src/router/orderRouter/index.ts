import { requestPickUp, getCity, getOrderType, getProvince } from "@/controllers/orderController";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const orderRouter = Router()
orderRouter.post('/keep-auth-user', tokenValidation, requestPickUp)
orderRouter.get('/type', tokenValidation, getOrderType)
orderRouter.get('/province', getProvince)
orderRouter.get('/city', getCity)

export default orderRouter