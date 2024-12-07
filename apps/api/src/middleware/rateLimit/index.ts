import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,  // ini selama 1 menit
    max: 10, /* *utk memberiakn batas request sesuai waktu yg ditentukan */
    keyGenerator: (req: Request) => {
        return req.body.userId
    },
    handler: (req: Request, res: Response, next: NextFunction) => {
        res.status(404).json({
            error: true,
            message: 'Terlalu banyak melakukan request, coba beberapa saat lagi',
            data: {}
        })
    }
})