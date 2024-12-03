import { NextFunction, Request, Response } from "express";

export const tokenValidation = async (req: Request, res: Response, next: NextFunction) => {
    const { authorizationRole, userId } = req.body

    if (authorizationRole != 'ADMIN') throw { msg: 'Anda tidak memiliki akses', status: 406 }

    if (authorizationRole && userId) {
        req.body.authorizationRole = authorizationRole
        req.body.userId = userId
    }
    
    next()
}