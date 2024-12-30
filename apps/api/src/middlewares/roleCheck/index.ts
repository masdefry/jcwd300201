import { NextFunction, Request, Response } from "express";

export const roleCheckAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { authorizationRole, userId } = req.body
    if (authorizationRole != 'OUTLET_ADMIN') throw { msg: 'Anda tidak memiliki akses', status: 406 }

    if (authorizationRole && userId) {
        req.body.authorizationRole = authorizationRole
        req.body.userId = userId
    }

    next()
}

export const roleCheckWashingWorker = (req: Request, res: Response, next: NextFunction) => {
    const { authorizationRole, userId } = req.body

    if (authorizationRole !== 'WASHING_WORKER') throw { msg: 'Anda tidak memiliki akses', status: 406 }
    if (authorizationRole && userId) {
        req.body.authorizationRole = authorizationRole
        req.body.userId = userId
    }

    next()
}

export const roleCheckIroningWorker = (req: Request, res: Response, next: NextFunction) => {
    const { authorizationRole, userId } = req.body

    if (authorizationRole != 'IRONING_WORKER') throw { msg: 'Anda tidak memiliki akses', status: 406 }

    if (authorizationRole && userId) {
        req.body.authorizationRole = authorizationRole
        req.body.userId = userId
    }

    next()
}

export const roleCheckPackingWorker = (req: Request, res: Response, next: NextFunction) => {
    const { authorizationRole, userId } = req.body

    if (authorizationRole != 'PACKING_WORKER') throw { msg: 'Anda tidak memiliki akses', status: 406 }

    if (authorizationRole && userId) {
        req.body.authorizationRole = authorizationRole
        req.body.userId = userId
    }

    next()
}

export const roleCheckSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { authorizationRole, userId } = req.body

    if (authorizationRole != 'SUPER_ADMIN') throw { msg: 'Anda tidak memiliki akses', status: 406 }

    if (authorizationRole && userId) {
        req.body.authorizationRole = authorizationRole
        req.body.userId = userId
    }

    next()
}

export const roleCheckDriver = (req: Request, res: Response, next: NextFunction) => {
    const { authorizationRole, userId } = req.body

    if (authorizationRole != 'DRIVER') throw { msg: 'Anda tidak memiliki akses', status: 406 }
    if (authorizationRole && userId) {
        req.body.authorizationRole = authorizationRole
        req.body.userId = userId
    }

    next()
}

export const roleCheckCustomer = (req: Request, res: Response, next: NextFunction) => {
    const { authorizationRole, userId } = req.body

    if (authorizationRole != 'CUSTOMER') throw { msg: 'Hak akses hanya milik user', status: 401 }

    if (authorizationRole && userId) {
        req.body.authorizationRole = authorizationRole
        req.body.userId = userId
    }

    next()
}