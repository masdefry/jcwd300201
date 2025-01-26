import prisma from "@/connection"
import { createWorkerService, resendEmailUserService, resendEmailWorkerService, setPasswordUserService, setPasswordWorkerService, signInWithGoogleService, userLoginService, userRegisterService, workerLoginService } from "@/services/authService";
import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import jwt from 'jsonwebtoken'
import { hashPassword } from "@/utils/passwordHash";
import { encodeToken } from "@/utils/tokenValidation";
import { Prisma } from "@prisma/client";

const secret_key: string | undefined = process.env.JWT_SECRET as string

export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, firstName, lastName, phoneNumber } = req?.body
        const verifyCode = nanoid(6)
        const dateNow = Date.now() * Math.random()
        const id = `CUST${Math.floor(dateNow)}${firstName.toUpperCase()}`

        await userRegisterService({ id, email, firstName, lastName, phoneNumber, verifyCode })

        res?.status(200).json({
            error: false,
            message: 'Berhasil mendaftar akun, silahkan verifikasi email untuk melanjutkan login',
            data: {}
        })

    } catch (error) {
        next(error)
    }
}

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req?.body

        const { findUser, token } = await userLoginService({ email, password })

        res?.status(200).json({
            error: false,
            message: 'Berhasil, silahkan masuk!',
            data: {
                token,
                email,
                role: findUser?.role,
                firstName: findUser?.firstName,
                lastName: findUser?.lastName,
                isVerify: findUser?.isVerified,
                profilePicture: findUser?.profilePicture,
                phoneNumber: findUser?.phoneNumber
            }
        })
    } catch (error) {
        next(error)
    }
}

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body
        const { authorization } = req.headers
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const findUser = await tx.user.findFirst({ where: { email } })
            if (!findUser) throw { msg: 'Pengguna tidak tersedia', status: 404 }
            let token = authorization?.split(' ')[1] as string

            jwt.verify(token, secret_key, (err) => {
                if (err) throw { msg: 'Ada kesalahan saat mencoba logout', status: 401 }

                req.app.locals.credentials = null
            })
        }, { timeout: 30000 })

        res.status(200).json({
            error: false,
            message: 'Logout Berhasil!',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const signInWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, profilePicture } = req.body;
        const verifyCode = nanoid(6);
        const dateNow = Date.now() * Math.random()
        const id = `CUST${Math.floor(dateNow)}${firstName.toUpperCase()}`

        const { findEmail, token } = await signInWithGoogleService({ email })

        if (findEmail) {
            res.status(200).json({
                error: false,
                message: 'Masuk menggunakan Google berhasil!',
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
                    id,
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

export const resendEmailUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body
        await resendEmailUserService({ email })

        res.status(200).json({
            error: false,
            message: 'Harap cek email anda secara berkala',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const resendEmailWorker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body
        await resendEmailWorkerService({ email })

        res.status(200).json({
            error: false,
            message: 'Harap cek email anda secara berkala',
            data: {}
        })

    } catch (error) {
        next(error)
    }
}

export const setPasswordUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, password } = req.body
        const { authorization } = req.headers

        if (!authorization) {
            return res.status(400).json({
                error: true,
                message: 'Anda tidak berwenang untuk mengganti password',
                data: {}
            });
        }
        await setPasswordUserService({ authorization, userId, password })

        res.status(200).json({
            error: false,
            message: 'Berhasil, silahkan masuk!',
            data: {}
        })

    } catch (error) {
        next(error)
    }
}

export const setPasswordWorker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, password } = req.body
        const { authorization } = req.headers

        if (!authorization) {
            return res.status(400).json({
                error: true,
                message: 'Anda tidak berwenang untuk mengganti password',
                data: {}
            });
        }
        await setPasswordWorkerService({ authorization, userId, password })

        res.status(200).json({
            error: false,
            message: 'Berhasil, silahkan masuk!',
            data: {}
        })

    } catch (error) {
        next(error)
    }
}

export const workerLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body
        const { findAdmin, token } = await workerLoginService({ email, password })

        if (!findAdmin) {
            return res.status(404).json({
                error: true,
                message: 'User not found',
            })
        }
        res?.status(200).json({
            error: false,
            message: 'Berhasil, silahkan masuk!',
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

export const workerRegisterByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, firstName, lastName, phoneNumber, workerRole, identityNumber, outletId, shiftId, motorcycleType, plateNumber } = req.body
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
            storeId: outletId,
            motorcycleType,
            plateNumber,
            shiftId
        })

        res.status(201).json({
            error: false,
            message: 'Berhasil membuat data pekerja, silahkan verifikasi email anda',
            data: {}
        })

    } catch (error) {
        next(error)
    }
}

export const workerLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const findAdmin = await tx.worker.findFirst({
                where: { email }
            })

            if (!findAdmin) throw { msg: 'Pengguna belom melakukan login', status: 400 }

            const { authorization } = req.headers
            let token = authorization?.split(' ')[1] as string

            jwt.verify(token, secret_key, (err) => {
                if (err) throw { msg: 'Ada kesalahan saat proses logout, silahkan coba lagi nanti', status: 401 }

                req.app.locals.credentials = null
            })
        }, { timeout: 30000 })

        res.status(200).json({
            error: false,
            message: 'Logout berhasil!',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const userKeepAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, authorizationRole } = req.body

        let findUser
        let findAdmin
        let findWorker
        let orderTrack

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
            orderTrack = await prisma.order.findMany({ where: { deletedAt: null } })
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
                orders: orderTrack!.length,
                store: findAdmin?.Store?.storeName
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