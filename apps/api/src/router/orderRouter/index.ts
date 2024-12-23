import { requestPickUp, getCity, getOrderType, getProvince, findNearestStore, getUserOrder, acceptOrderOutlet, getCreateNotaOrder, solveNotes, getOrdersForDelivery, requestDeliveryDone, getOrdersForDriverDelivery, acceptOrderDelivery, processOrderDelivery, getAllOrderForAdmin, orderStatus } from "@/controllers/orderController";
import { acceptOrder, createOrder, getOrderItemDetail, getOrderNoteDetail, getOrdersForDriver, getOrdersForWashing, washingProcess, washingProcessDone, getOrdersForIroning, ironingProcess, ironingProcessDone, packingProcess, packingProcessDone, getOrdersForPacking, getWashingHistory, getIroningHistory, getPackingHistory, getNotes } from '@/controllers/orderController'
import { limiter } from "@/middleware/rateLimit";
import { roleCheckAdmin, roleCheckCustomer, roleCheckSuperAdmin } from "@/middleware/roleCheck";
import { requestPickUpValidation } from "@/middleware/validation";
import { expressValidatorErrorHandling } from "@/middleware/validation/errorHandlingValidator";

import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const orderRouter = Router()

/* get data location */
orderRouter.get('/', tokenValidation, getUserOrder)
orderRouter.get('/type', getOrderType)
orderRouter.get('/province', getProvince)
orderRouter.get('/city', getCity)
orderRouter.get('/nearest-store', tokenValidation, findNearestStore)

// List Worker Order
orderRouter.get('/order-washing', tokenValidation, getOrdersForWashing)
orderRouter.get('/order-ironing', tokenValidation, getOrdersForIroning)
orderRouter.get('/order-packing', tokenValidation, getOrdersForPacking)

// Order Process
orderRouter.post('/washing-process/:orderId', tokenValidation, washingProcess)
orderRouter.post('/washing-done/:orderId', tokenValidation, washingProcessDone)
orderRouter.post('/ironing-process/:orderId', tokenValidation, ironingProcess)
orderRouter.post('/ironing-done/:orderId', tokenValidation, ironingProcessDone)
orderRouter.post('/packing-process/:orderId', tokenValidation, packingProcess)
orderRouter.post('/packing-done/:orderId', tokenValidation, packingProcessDone)

// User Request Pickup
orderRouter.post('/request-pickup', tokenValidation, limiter, requestPickUp)

// Driver Terima Pengantaran
orderRouter.get('/order', tokenValidation, getOrdersForDriver)
orderRouter.post('/accept-order/:orderId', tokenValidation, acceptOrder)
orderRouter.post('/accept-outlet/:orderId', tokenValidation, acceptOrderOutlet)

// Create Nota Order
orderRouter.get('/detail-order-note/:id', tokenValidation, getOrderNoteDetail)
orderRouter.get('/order-detail/:orderId', tokenValidation, getOrderItemDetail)
orderRouter.post('/order/:orderId', tokenValidation, createOrder)

// History Order
orderRouter.get('/history-washing/', tokenValidation, getWashingHistory)
orderRouter.get('/history-ironing/', tokenValidation, getIroningHistory)
orderRouter.get('/history-packing/', tokenValidation, getPackingHistory)

// Nota Order
orderRouter.get('/order-notes', tokenValidation, getNotes)
orderRouter.patch('/order-notes/:orderId', tokenValidation, solveNotes)

// Create Nota Order
orderRouter.get('/nota-order', tokenValidation, getCreateNotaOrder)

// Request Delivery to Cust (by Admin)
orderRouter.get('/order-delivery', tokenValidation, getOrdersForDelivery)
orderRouter.patch('/order-delivery/:orderId', tokenValidation, requestDeliveryDone)

// Driver
orderRouter.get('/delivery', tokenValidation, getOrdersForDriverDelivery)
orderRouter.post('/delivery-process/:orderId', tokenValidation, processOrderDelivery)
orderRouter.post('/delivery-accept/:orderId', tokenValidation, acceptOrderDelivery)/* tracking order super admin */

// Get Admin Order List
orderRouter.get('/orders', tokenValidation, getAllOrderForAdmin)
orderRouter.get('/orders-detail/:orderId', tokenValidation, orderStatus)


export default orderRouter