import { createLaundryItems, deleteLaundryItems, getLaundryItems, getListItem, updateLaundryItems } from "@/controllers/laundryItemController";
import { limiter } from "@/middlewares/rateLimit";
import { roleCheckSuperAdmin } from "@/middlewares/roleCheck";
import { productLaundryValidation } from "@/middlewares/validation";
import { tokenValidation } from "@/middlewares/verifyToken";
import { Router } from "express";

const laundryRouter = Router()

laundryRouter.get('/', tokenValidation, getListItem)
laundryRouter.post('/', tokenValidation, roleCheckSuperAdmin, limiter, productLaundryValidation, createLaundryItems)
laundryRouter.get('/laundry-items', tokenValidation, roleCheckSuperAdmin, getLaundryItems)
laundryRouter.patch('/laundry-item/:id', tokenValidation, roleCheckSuperAdmin, limiter, deleteLaundryItems)
laundryRouter.patch('/laundry-items/:id', tokenValidation, roleCheckSuperAdmin, limiter, productLaundryValidation, updateLaundryItems)

export default laundryRouter