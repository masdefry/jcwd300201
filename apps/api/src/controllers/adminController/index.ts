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

export const createWorker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, firstName, lastName, phoneNumber, workerRole, identityNumber, storesId, motorcycleType, plateNumber } = req.body
        const dateNow = Date.now() * Math.random()
        const customRole = workerRole?.slice(0, 3)
        const id = `${customRole}${Math.floor(dateNow)}${firstName?.toUpperCase()}`

        await createWorkerService({
            id,
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
        const { search = '', sort = '', page = 1, limit = 5 } = req.query;

        const take = parseInt(limit as string)
        const skip = (parseInt(page as string) - 1) * take

        let whereClause: any = {}

        if (search) {
            whereClause = {
                OR: [
                    { id: { contains: search as string } },
                    { firstName: { contains: search as string } },
                    { lastName: { contains: search as string } },
                    { email: { contains: search as string } }
                ]
            }
        } else if (typeof sort === 'string') {
            const roles = ['super_admin', 'driver', 'washing_worker', 'ironing_worker', 'packing_worker', 'outlet_admin'] as string[]
            if (roles.includes(sort)) {
                whereClause.workerRole = sort.toUpperCase()
            }
        }

        const findWorker = await prisma.worker.findMany({
            where: whereClause,
            take,
            skip,
            orderBy: { createdAt: 'desc' }
        })

        const totalData = await prisma.worker.count({
            where: whereClause
        })

        if (findWorker?.length === 0) throw { msg: 'Data pekerja tidak tersedia', status: 404 }

        const totalPages = Math.ceil(totalData / take)

        res.status(200).json({
            error: false,
            message: 'Berhasil mendapatkan data pekerja',
            data: { findWorker, totalPages, currentPage: page, entriesPerPage: limit }
        })
    } catch (error) {
        next(error)
    }
}

export const getSingleWorker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        const findUser = await prisma.worker.findFirst({ where: { id } })
        if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }

        res.status(200).json({
            error: false,
            message: 'Berhasil mendapatkan data worker',
            data: findUser
        })

    } catch (error) {
        next(error)
    }
}

export const deleteDataWorker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        const findWorker = await prisma.worker.findFirst({ where: { id } })
        if (!findWorker) throw { msg: 'User tidak tersedia atau sudah terhapus', status: 404 }
        if (findWorker?.workerRole === 'SUPER_ADMIN') throw { msg: 'Gagal menghapus, silahkan pilih pekerja yang lain', status: 401 }

        await prisma.worker.delete({ where: { id } })

        res.status(200).json({
            error: false,
            message: 'Berhasil menghapus data',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const getItemName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 5, search = '', sort } = req.query

        const take = parseInt(limit as string)
        const skip = (parseInt(page as string) - 1) * take
        let whereClause;

        if (search) {
            whereClause = {
                OR: [
                    { itemName: { contains: search as string } },
                ]
            }
        }
        let findItem: any


        const totalData = await prisma.itemName.count({
            where: whereClause
        })

        if (sort == 'name-asc') {
            findItem = await prisma.itemName.findMany({
                where: whereClause, take, skip, orderBy: { itemName: 'asc' }

            })
        } else if (sort == 'name-desc') {
            findItem = await prisma.itemName.findMany({
                where: whereClause, take, skip, orderBy: { itemName: 'desc' }
            })
        } else if (sort == 'latest-item') {
            findItem = await prisma.itemName.findMany({
                where: whereClause, take, skip, orderBy: { createdAt: 'desc' }
            })
        } else if (sort == 'oldest-item') {
            findItem = await prisma.itemName.findMany({
                where: whereClause, take, skip, orderBy: { createdAt: 'asc' }
            })
        } else {
            findItem = await prisma.itemName.findMany({
                where: whereClause, take, skip, orderBy: { createdAt: 'asc' }
            })
        }

        if (findItem?.length === 0) throw { msg: 'Data item tidak tersedia', status: 404 }
        const totalPage = Math.ceil(totalData / Number(limit))

        res.status(200).json({
            error: false,
            message: "Data berhasil didapat!",
            data: { findItem, totalPage, currentPage: page, entriesPerPage: limit }
        });
    } catch (error) {
        next(error);
    }
}

export const createProductLaundry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { itemName } = req.body

        const findName = await prisma.itemName.findFirst({
            where: { itemName }
        })

        if (findName) throw { msg: 'Data sudah tersedia', status: 406 }

        await prisma.itemName.create({ data: { itemName } })

        res.status(200).json({
            error: false,
            message: 'Berhasil membuat produk',
            data: {}
        })

    } catch (error) {
        next(error)
    }
}

export const deleteDataProductLaundry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params

        const findItem = await prisma.itemName.findFirst({ where: { id: Number(id) } })

        if (!findItem) throw { msg: 'Data sudah tidak tersedia atau sudah terhapus', status: 404 }

        await prisma.itemName.delete({
            where: { id: Number(id) }
        })

        res.status(200).json({
            error: false,
            message: 'Berhasil menghapus data',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}