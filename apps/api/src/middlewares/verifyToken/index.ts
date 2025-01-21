import { NextFunction, Request, Response } from "express";
import { decodeToken } from "@/utils/tokenValidation";

interface DecodedToken {
    data: {
        id: string;
        role: string;
        storeId: string;
    };
}

export const tokenValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers
        const token = authorization?.split(' ')[1]

        if (!token) throw { msg: 'Harap login terlebih dahulu', status: 406 }

        const tokenVerify = await decodeToken(token)
        if ((tokenVerify as DecodedToken)?.data) {

            req.body.userId = (tokenVerify as DecodedToken)?.data?.id
            req.body.authorizationRole = (tokenVerify as DecodedToken)?.data?.role
            req.body.storeId = (tokenVerify as DecodedToken)?.data?.storeId

            next()
        } else {
            throw { msg: 'Token tidak valid', status: 401 };
        }
    } catch (error) {
        next(error)
    }
}