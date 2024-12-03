import { uploadMulter } from "@/utils/multer";
import { NextFunction, Request, Response } from "express";

export const uploader = (req: Request, res: Response, next: NextFunction) => {
    const uploads = uploadMulter.fields([{ name: 'images', maxCount: 2 }])
    const { userId, authorizationRole } = req.body

    uploads(req, res, (err) => {
        try {
            if (err) throw { msg: err?.message, status: 400 }
            if (userId && authorizationRole) {
                req.body.userId = userId
                req.body.authorizationRole = authorizationRole
            }
            
            next()
        } catch (error) {
            next(error)
        }
    })
}