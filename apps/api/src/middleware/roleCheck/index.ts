import { NextFunction, Request, Response } from "express";

export const roleCheckAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { authorizationRole, userId } = req.body

    if (authorizationRole != 'OUTLET_ADMIN' || authorizationRole !== 'SUPER_ADMIN') throw { msg: 'Anda tidak memiliki akses', status: 406 }

    if (authorizationRole && userId) {
        req.body.authorizationRole = authorizationRole
        req.body.userId = userId
    }
    
    next()
}

export const roleCheckWashingWorker = async (req: Request, res: Response, next: NextFunction) => {
    const { authorizationRole, userId } = req.body

    if (authorizationRole != 'WASHING_WORKER' || authorizationRole !== 'SUPER_ADMIN') throw { msg: 'Anda tidak memiliki akses', status: 406 }

    if (authorizationRole && userId) {
        req.body.authorizationRole = authorizationRole
        req.body.userId = userId
    }
    
    next()
}

export const roleCheckIroningWorker = async (req: Request, res: Response, next: NextFunction) => {
    const { authorizationRole, userId } = req.body

    if (authorizationRole != 'IRONING_WORKER' || authorizationRole !== 'SUPER_ADMIN') throw { msg: 'Anda tidak memiliki akses', status: 406 }

    if (authorizationRole && userId) {
        req.body.authorizationRole = authorizationRole
        req.body.userId = userId
    }
    
    next()
}

export const roleCheckPackingWorker = async (req: Request, res: Response, next: NextFunction) => {
    const { authorizationRole, userId } = req.body

    if (authorizationRole != 'PACKING_WORKER' || authorizationRole !== 'SUPER_ADMIN') throw { msg: 'Anda tidak memiliki akses', status: 406 }

    if (authorizationRole && userId) {
        req.body.authorizationRole = authorizationRole
        req.body.userId = userId
    }
    
    next()
}

export const roleCheckSuperAdmin = async(req: Request, res: Response, next: NextFunction)=> {
    const { authorizationRole, userId } = req.body

    if (authorizationRole != 'SUPER_ADMIN') throw { msg: 'Anda tidak memiliki akses', status: 406 }

    if (authorizationRole && userId) {
        req.body.authorizationRole = authorizationRole
        req.body.userId = userId
    }
    
    next()
}