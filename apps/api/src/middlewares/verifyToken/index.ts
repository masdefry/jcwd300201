import { NextFunction, Request, Response } from "express";
import { decodeToken } from "@/utils/tokenValidation";

export const tokenValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers
        const token = authorization?.split(' ')[1]

        if (!token) throw { msg: 'Harap login terlebih dahulu', status: 406 }

        const tokenVerify: any = await decodeToken(token)

        req.body.userId = tokenVerify?.data?.id
        req.body.authorizationRole = tokenVerify?.data?.role
        req.body.storeId = tokenVerify?.data?.storeId

        next()
    } catch (error) {
        next(error)
    }
}