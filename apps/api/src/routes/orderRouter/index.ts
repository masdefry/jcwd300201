import { requestPickUp, getCity, getOrderType, getProvince, findNearestStore, getUserOrder, acceptOrderOutlet, getCreateNotaOrder, solveNotes, getOrdersForDelivery, requestDeliveryDone, getOrdersForDriverDelivery, acceptOrderDelivery, processOrderDelivery, getAllOrderForAdmin, orderStatus, getDriverHistory, getAllOrderForUser, paymentOrderVA, paymentOrderTf, getPaymentOrderForAdmin, paymentDone, userConfirmOrder, orderTrackingAdmin, orderTrackingDriver, orderTrackingWorker, orderTrackingUser, getOrdersForNotif, customerComplaint, solveComplaint } from "@/controllers/orderController";
import { acceptOrder, createOrder, getOrderItemDetail, getOrderNoteDetail, getOrdersForDriver, getOrdersForWashing, washingProcess, washingProcessDone, getOrdersForIroning, ironingProcess, ironingProcessDone, packingProcess, packingProcessDone, getOrdersForPacking, getWashingHistory, getIroningHistory, getPackingHistory, getNotes } from '@/controllers/orderController'
import { limiter } from "@/middlewares/rateLimit";
import { roleCheckAdmin, roleCheckCustomer, roleCheckDriver, roleCheckIroningWorker, roleCheckPackingWorker, roleCheckSuperAdmin, roleCheckWashingWorker } from "@/middlewares/roleCheck";
import { uploader } from "@/middlewares/uploader";

import { tokenValidation } from "@/middlewares/verifyToken";
import { Router } from "express";

const orderRouter = Router()

orderRouter.get('/', tokenValidation, getUserOrder)
orderRouter.get('/type', getOrderType)
orderRouter.get('/province', getProvince)
orderRouter.get('/city', getCity)
orderRouter.get('/nearest-store', tokenValidation, findNearestStore)

orderRouter.get('/order-washing', tokenValidation, roleCheckWashingWorker, getOrdersForWashing)
orderRouter.get('/order-ironing', tokenValidation, roleCheckIroningWorker, getOrdersForIroning)
orderRouter.get('/order-packing', tokenValidation, roleCheckPackingWorker, getOrdersForPacking)

orderRouter.post('/washing-process/:orderId', tokenValidation, roleCheckWashingWorker, washingProcess)
orderRouter.post('/washing-done/:orderId', tokenValidation, roleCheckWashingWorker, washingProcessDone)
orderRouter.post('/ironing-process/:orderId', tokenValidation, roleCheckIroningWorker, ironingProcess)
orderRouter.post('/ironing-done/:orderId', tokenValidation, roleCheckIroningWorker, ironingProcessDone)
orderRouter.post('/packing-process/:orderId', tokenValidation, roleCheckPackingWorker, packingProcess)
orderRouter.post('/packing-done/:orderId', tokenValidation, roleCheckPackingWorker, packingProcessDone)

orderRouter.post('/request-pickup', tokenValidation, roleCheckCustomer, limiter, requestPickUp)

orderRouter.get('/order', tokenValidation, getOrdersForDriver)
orderRouter.post('/accept-order/:orderId', tokenValidation, roleCheckDriver, acceptOrder)
orderRouter.post('/accept-outlet/:orderId', tokenValidation, roleCheckDriver, acceptOrderOutlet)

orderRouter.get('/detail-order-note/:id', tokenValidation, getOrderNoteDetail)
orderRouter.get('/order-detail/:orderId', tokenValidation, getOrderItemDetail)
orderRouter.post('/order/:orderId', tokenValidation, roleCheckAdmin, createOrder)

orderRouter.get('/history-washing/', tokenValidation, getWashingHistory)
orderRouter.get('/history-ironing/', tokenValidation, getIroningHistory)
orderRouter.get('/history-packing/', tokenValidation, getPackingHistory)
orderRouter.get('/history-driver/', tokenValidation, getDriverHistory)
orderRouter.get('/history-user/', tokenValidation, getAllOrderForUser)

orderRouter.get('/order-notes', tokenValidation, roleCheckAdmin, getNotes)
orderRouter.patch('/order-notes/:orderId', tokenValidation, roleCheckAdmin, solveNotes)

orderRouter.get('/nota-order', tokenValidation, roleCheckAdmin, getCreateNotaOrder)

orderRouter.get('/order-delivery', tokenValidation, getOrdersForDelivery)
orderRouter.patch('/order-delivery/:orderId', tokenValidation, roleCheckAdmin, requestDeliveryDone)

orderRouter.get('/delivery', tokenValidation, getOrdersForDriverDelivery)
orderRouter.post('/delivery-process/:orderId', tokenValidation, roleCheckDriver, processOrderDelivery)
orderRouter.post('/delivery-accept/:orderId', tokenValidation, roleCheckDriver, acceptOrderDelivery)

orderRouter.get('/orders', tokenValidation, getAllOrderForAdmin)
orderRouter.get('/orders-detail/:orderId', tokenValidation, orderStatus)

orderRouter.post('/payment/:orderId', tokenValidation, roleCheckCustomer, paymentOrderVA)
orderRouter.post('/payment-tf/:orderId', tokenValidation, roleCheckCustomer, uploader, paymentOrderTf)
orderRouter.get('/payment/', tokenValidation, getPaymentOrderForAdmin)
orderRouter.post('/payment-done/:orderId', tokenValidation, roleCheckAdmin, paymentDone)

orderRouter.post('/confirm/:orderId', tokenValidation, userConfirmOrder)

orderRouter.get('/tracking', tokenValidation, orderTrackingAdmin)
orderRouter.get('/tracking-driver', tokenValidation, roleCheckDriver, orderTrackingDriver)
orderRouter.get('/tracking-worker', tokenValidation, orderTrackingWorker)
orderRouter.get('/tracking-user', tokenValidation, roleCheckCustomer, orderTrackingUser)

orderRouter.get('/notification', tokenValidation, getOrdersForNotif)

orderRouter.patch('/complaint/:orderId', tokenValidation, customerComplaint)
orderRouter.patch('/solve/:orderId', tokenValidation, solveComplaint)
export default orderRouter