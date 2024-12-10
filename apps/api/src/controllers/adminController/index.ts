import prisma from "@/connection";
import { adminLoginService } from "@/service/adminService/index";
import { createWorkerService } from "@/service/adminService/index";
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
        const { email, storesId } = req.body
        console.log(storesId, '<<<<<<<<<<<')

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

export const createWorker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, firstName, lastName, phoneNumber, workerRole, identityNumber, storesId, motorcycleType, plateNumber } = req.body

        await createWorkerService({
            email,
            firstName,
            lastName,
            phoneNumber,
            workerRole,
            identityNumber,
            storesId,
            motorcycleType,
            plateNumber
        })

        res.status(201).json({
            error: false,
            message: 'Berhasil membuat data, silahkan login',
            data: {}
        })

    } catch (error) {
        next(error)
    }
}

export const getAllWorker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, sort } = req.query

        let findWorker
        if (search) {
            findWorker = await prisma.worker.findMany({
                where: {
                    OR: [
                        { firstName: { contains: search as string } },
                        { lastName: { contains: search as string } },
                        { email: { contains: search as string } }
                    ]
                }
            })
        } else if (sort && sort === 'SUPER_ADMIN') {
            findWorker = await prisma.worker.findMany({
                where: { workerRole: 'SUPER_ADMIN' }
            })
        } else {
            findWorker = await prisma.worker.findMany()
        }
        
        if (findWorker?.length === 0) throw { msg: 'Data pekerja tidak tersedia', status: 404 }

        res.status(200).json({
            error: false,
            message: 'Berhasil mendapatkan data pekerja',
            data: findWorker
        })
    } catch (error) {
        next(error)
    }
}