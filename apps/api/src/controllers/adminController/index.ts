import prisma from "@/connection";
import { validateEmail } from "@/middleware/validation/emailValidation";
import { comparePassword } from "@/utils/passwordHash";
import { encodeToken } from "@/utils/tokenValidation";
import { NextFunction, Request, Response } from "express";

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body

        if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 400 }

        const findAdmin = await prisma.worker.findFirst({
            where: { email }
        })

        if (!findAdmin) throw { msg: 'User admin tidak tersedia', status: 404 }

        const match = await comparePassword(password, findAdmin?.password)
        if (!match) throw { msg: 'Password anda salah!', status: 401 }

        const token = await encodeToken({ id: findAdmin?.id, role: findAdmin?.workerRole })

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