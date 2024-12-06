import prisma from "@/connection";
import { adminLoginService } from "@/service/adminLoginService";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

const secret_key: string | undefined = process.env.JWT_SECRET as string
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body

        const { findAdmin, token } = await adminLoginService({ email, password })

        res?.status(200).json({
            error: false,
            message: 'Berhasil login, silahkan masuk',
            data: {
                token,
                email,
                role: findAdmin?.workerRole,
                firstName: findAdmin?.firstName,
                lastName: findAdmin?.lastName,
                profilePicture: findAdmin?.profilePicture,
                phoneNumber: findAdmin?.phoneNumber
            }
        })

    } catch (error) {
        next(error)
    }
}

export const adminLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body

        const findAdmin = await prisma.worker.findFirst({
            where: { email }
        })

        if (!findAdmin) throw { msg: 'User belom login', status: 400 }

        const { authorization } = req.headers
        let token = authorization?.split(' ')[1] as string

        jwt.verify(token, secret_key, (err) => {
            if (err) throw { msg: 'Invalid token', status: 401 }

            req.app.locals.credentials = null
        })

        res.status(200).json({
            error: false,
            message: 'Berhasil logout!',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}