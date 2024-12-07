import { requestPickUp, getCity, getOrderType, getProvince, findNearestStore } from "@/controllers/orderController";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const orderRouter = Router()
orderRouter.get('/type', getOrderType)
orderRouter.get('/province', getProvince)
orderRouter.get('/city', getCity)
orderRouter.get('/nearest-store', tokenValidation, findNearestStore)
orderRouter.post('/request-pickup', tokenValidation, requestPickUp)

export default orderRouter