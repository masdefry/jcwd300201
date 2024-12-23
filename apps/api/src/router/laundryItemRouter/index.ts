import { createLaundryItems, deleteLaundryItems, getLaundryItems, getListItem, updateLaundryItems } from "@/controllers/laundryItemController";
import { limiter } from "@/middleware/rateLimit";
import { roleCheckSuperAdmin } from "@/middleware/roleCheck";
import { productLaundryValidation } from "@/middleware/validation";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const laundryRouter = Router()

laundryRouter.get('/',tokenValidation, getListItem)
laundryRouter.post('/', tokenValidation, roleCheckSuperAdmin, limiter, productLaundryValidation, createLaundryItems)
laundryRouter.get('/laundry-items', tokenValidation, roleCheckSuperAdmin, getLaundryItems)
laundryRouter.delete('/laundry-items/:id', tokenValidation, roleCheckSuperAdmin, limiter, deleteLaundryItems)
laundryRouter.patch('/laundry-items/:id', tokenValidation, roleCheckSuperAdmin, limiter, productLaundryValidation, updateLaundryItems)

export default laundryRouter