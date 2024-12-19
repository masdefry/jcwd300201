import { requestPickUp, getCity, getOrderType, getProvince, findNearestStore, getUserOrder } from "@/controllers/orderController";
import { acceptOrder, createOrder, getOrderItemDetail, getOrderNoteDetail, getOrdersForDriver, getOrdersForWashing, washingProcess, washingProcessDone, getOrdersForIroning, ironingProcess, ironingProcessDone, packingProcess, packingProcessDone, getOrdersForPacking, getWashingHistory, getIroningHistory, getPackingHistory, getNotes } from '@/controllers/orderController'

import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const orderRouter = Router()

/* get data location */
orderRouter.get('/', tokenValidation, getUserOrder)
orderRouter.get('/type', getOrderType)
orderRouter.get('/province', getProvince)
orderRouter.get('/city', getCity)
orderRouter.get('/nearest-store', tokenValidation, findNearestStore)
orderRouter.post('/request-pickup', tokenValidation, requestPickUp)


orderRouter.get('/order', tokenValidation, getOrdersForDriver)
orderRouter.get('/order-washing', tokenValidation, getOrdersForWashing)
orderRouter.get('/order-ironing', tokenValidation, getOrdersForIroning)
orderRouter.get('/order-packing', tokenValidation, getOrdersForPacking)
orderRouter.get('/order-notes', tokenValidation, getNotes)
orderRouter.post('/accept-order/:orderId', tokenValidation, acceptOrder)
orderRouter.get('/detail-order-note/:id', tokenValidation, getOrderNoteDetail)
orderRouter.post('/order/:orderId', tokenValidation, createOrder)
orderRouter.get('/order-detail/:orderId', tokenValidation, getOrderItemDetail)
orderRouter.post('/washing-process/:orderId', tokenValidation, washingProcess)
orderRouter.post('/washing-done/:orderId', tokenValidation, washingProcessDone)
orderRouter.post('/ironing-process/:orderId', tokenValidation, ironingProcess)
orderRouter.post('/ironing-done/:orderId', tokenValidation, ironingProcessDone)
orderRouter.post('/packing-process/:orderId', tokenValidation, packingProcess)
orderRouter.post('/packing-done/:orderId', tokenValidation, packingProcessDone)
orderRouter.get('/history-washing/', tokenValidation, getWashingHistory)
orderRouter.get('/history-ironing/', tokenValidation, getIroningHistory)
orderRouter.get('/history-packing/', tokenValidation, getPackingHistory)

export default orderRouter