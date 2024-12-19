import prisma from "@/connection"
import { createWorkerService, signInWithGoogleService, userLoginService, userRegisterService, workerLoginService } from "@/service/authService";
import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import jwt from 'jsonwebtoken'
import { hashPassword } from "@/utils/passwordHash";
import { encodeToken } from "@/utils/tokenValidation";

const secret_key: string | undefined = process.env.JWT_SECRET as string

/* user authenticate */

/* user register */
export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, firstName, lastName, phoneNumber } = req?.body
        const verifyCode = nanoid(6)
        const dateNow = Date.now() * Math.random()
        const id = `CUST${Math.floor(dateNow)}${firstName.toLowerCase()}`

        await userRegisterService({ id, email, firstName, lastName, phoneNumber, verifyCode })

        res?.status(200).json({
            error: false,
            message: 'Berhasil membuat akun, silahkan verifikasi email untuk login!',
            data: {}
        })

    } catch (error) {
        next(error)
    }
}

/* user login */
export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req?.body

        const dataLogin = await userLoginService({ email, password })

        res?.status(200).json({
            error: false,
            message: 'Berhasil login, silahkan masuk!',
            data: {
                token: dataLogin?.token,
                email,
                role: dataLogin?.findUser?.role,
                firstName: dataLogin?.findUser?.firstName,
                lastName: dataLogin?.findUser?.lastName,
                isVerify: dataLogin?.findUser?.isVerified,
                profilePicture: dataLogin?.findUser?.profilePicture,
                phoneNumber: dataLogin?.findUser?.phoneNumber
            }
        })
    } catch (error) {
        next(error)
    }
}

/* user logout */
export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body
        const { authorization } = req.headers

        const findUser = await prisma.user.findFirst({ where: { email } })
        if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }
        let token = authorization?.split(' ')[1] as string

        jwt.verify(token, secret_key, (err) => {
            if (err) throw { msg: 'Token tidak valid', status: 401 }

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

/* user login with google */
export const signInWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, profilePicture } = req.body;
        const verifyCode = nanoid(6);

        const { findEmail, token } = await signInWithGoogleService({ email })

        if (findEmail) {
            res.status(200).json({
                error: false,
                message: 'Login menggunakan Google berhasil!',
                data: {
                    token,
                    email,
                    firstName: findEmail?.firstName,
                    lastName: findEmail?.lastName,
                    role: findEmail?.role,
                    phoneNumber: findEmail?.phoneNumber,
                    profilePicture: findEmail?.profilePicture,
                }
            })
        } else {
            const newUser = await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: await hashPassword('@googlesign123'),
                    role: 'CUSTOMER',
                    isVerified: Boolean(true),
                    phoneNumber: 'Belum terisi',
                    profilePicture: profilePicture,
                    isDiscountUsed: true,
                    isGoogleRegister: true,
                    isGooglePasswordChange: Boolean(true),
                    verifyCode
                }
            })

            const token = await encodeToken({ id: newUser?.id as string, role: newUser?.role as string })

            res.status(201).json({
                error: false,
                message: 'Masuk menggunakan Google berhasil!',
                data: {
                    token,
                    email,
                    firstName: newUser?.firstName,
                    lastName: newUser?.lastName,
                    role: newUser?.role,
                    phoneNumber: newUser?.phoneNumber,
                    profilePicture: newUser?.profilePicture,
                }
            })
        }

    } catch (error) {
        next(error)
    }
}


/* worker authentication */

/* worker login */
export const workerLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body
        const { findAdmin, token } = await workerLoginService({ email, password })

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

/* worker register */
export const workerRegisterByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, firstName, lastName, phoneNumber, workerRole, identityNumber, storeId, motorcycleType, plateNumber } = req.body
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
            storeId,
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

/* worker logout */
export const workerLogout = async (req: Request, res: Response, next: NextFunction) => {
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

// keep auth
export const userKeepAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, authorizationRole } = req.body

        let findUser
        let findAdmin
        let findWorker
        let itemLaundry

        if (authorizationRole == 'CUSTOMER') {
            findUser = await prisma.user.findFirst({
                where: { id: userId, role: 'CUSTOMER' }
            })
        } else {
            findAdmin = await prisma.worker.findFirst({
                where: { id: userId, workerRole: authorizationRole },
                include: {
                    Store: true
                }
            })

            findWorker = await prisma.worker.findMany({ where: { deletedAt: null } })
            itemLaundry = await prisma.laundryItem.findMany({ where: { deletedAt: null } })
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
                email: findAdmin?.email,
                store: findAdmin?.Store?.storeName
            } : {}
        })

    } catch (error) {
        next(error)
    }
}