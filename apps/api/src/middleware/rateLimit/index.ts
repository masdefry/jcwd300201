import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    keyGenerator: (req: Request) => {
        return req.body.userId
    },
    handler: (req: Request, res: Response, next: NextFunction) => {
        res.status(404).json({
            error: true,
            message: 'Terlalu banyak request',
            data: {}
        })
    }
})