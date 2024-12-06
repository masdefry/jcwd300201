import prisma from "@/connection"
import { NextFunction, Request, Response } from "express";

export const userKeepAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, authorizationRole } = req.body

        console.log(authorizationRole)
        let findUser;
        let findAdmin;
        
        if (authorizationRole == 'CUSTOMER') {
            findUser = await prisma.users.findFirst({
                where: { id: userId, role: 'CUSTOMER' }
            })
        } else {
            findAdmin = await prisma.worker.findFirst({
                where: { id: userId, workerRole: authorizationRole }
            })
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
            } : authorizationRole != 'CUSTOMER' ? {
                role: findAdmin?.workerRole,
                firstName: findAdmin?.firstName,
                lastName: findAdmin?.lastName,
                profilePicture: findUser?.profilePicture,

                /**Sementara gini dulu */

                // email               String  @unique
                // password            String
                // workerRole          Role
                // firstName           String
                // lastName            String
                // phoneNumber         String  @db.Text
                // profilePicture      String  @db.Text
                // identityNumber      String? @db.Text
                // motorcycleType      String?
                // plateNumber         String?
                // changePasswordToken String? @db.Text
                // storesId            String?
            } : {}
        })
        
    } catch (error) {
        next(error)
    }
}