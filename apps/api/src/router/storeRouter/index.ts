import { getStore } from "@/controllers/stroreController";
import { Router } from "express";

const storeRouter = Router()
storeRouter.get('/', getStore)

export default storeRouter