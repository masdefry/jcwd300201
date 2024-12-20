import { getListItem } from "@/controllers/laundryItemController";
import { tokenValidation } from "@/middleware/verifyToken";
import { Router } from "express";

const laundryRouter = Router()
laundryRouter.get('/',tokenValidation, getListItem)

export default laundryRouter