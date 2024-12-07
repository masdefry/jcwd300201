import { requestPickUp, getCity, getOrderType, getProvince, findNearestStore } from "@/controllers/orderController";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const orderRouter = Router()
orderRouter.post('/keep-auth-user', tokenValidation, requestPickUp)
orderRouter.get('/type', getOrderType)
orderRouter.get('/province', getProvince)
orderRouter.get('/city', getCity)
orderRouter.get('/nearest-store', tokenValidation, findNearestStore)

export default orderRouter