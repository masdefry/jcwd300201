import { getCity, getOrderType, getProvince, requestPickUp } from "@/controllers/orderController";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const orderRouter = Router()
orderRouter.get('/type', tokenValidation, getOrderType)
orderRouter.get('/province', getProvince)
orderRouter.get('/city', getCity)


export default orderRouter