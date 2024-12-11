import prisma from "@/connection"
import { NextFunction, Request, Response } from "express";

export const userKeepAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, authorizationRole } = req.body

        let findUser
        let findAdmin
        let findWorker
        let itemLaundry

        if (authorizationRole == 'CUSTOMER') {
            findUser = await prisma.users.findFirst({
                where: { id: userId, role: 'CUSTOMER' }
            })
        } else {
            findAdmin = await prisma.worker.findFirst({
                where: { id: userId, workerRole: authorizationRole },
            })

            findWorker = await prisma.worker.findMany()
            itemLaundry = await prisma.itemName.findMany()
        }

        res.status(200).json({
            error: false,
            message: 'Data berhasil didapat!',
            data: authorizationRole == 'CUSTOMER' ? {
                role: findUser?.role,
                firstName: findUser?.firstName,
                lastName: findUser?.lastName,
                email: findUser?.email,
                isVerify: findUser?.isVerified,
                profilePicture: findUser?.profilePicture,
                isDiscountUsed: findUser?.isDiscountUsed
            } : authorizationRole == 'SUPER_ADMIN' ? {
                email: findAdmin?.email,
                role: findAdmin?.workerRole,
                firstName: findAdmin?.firstName,
                lastName: findAdmin?.lastName,
                profilePicture: findAdmin?.profilePicture,
                totalWorker: findWorker!.length,
                productLaundry: itemLaundry!.length
            } : authorizationRole !== 'CUSTOMER' && authorizationRole !== 'SUPER_ADMIN' ? {
                role: findAdmin?.workerRole,
                firstName: findAdmin?.firstName,
                lastName: findAdmin?.lastName,
                profilePicture: findAdmin?.profilePicture,
                email: findAdmin?.email
            } : {}
        })

    } catch (error) {
        next(error)
    }
}