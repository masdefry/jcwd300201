import prisma from "@/connection"
import { validateEmail } from "@/middlewares/validation/emailValidation"
import { phoneNumberValidation } from "@/middlewares/validation/phoneNumberValidation"
import { comparePassword, hashPassword } from "@/utils/passwordHash"
import { encodeToken } from "@/utils/tokenValidation"
import { transporter } from "@/utils/transporter"
import fs from 'fs'
import dotenv from 'dotenv'
import { compile } from "handlebars"
import { ICreateWorkerService, ILoginBody, IRegisterBody } from "./types"
import { addHours, format, isAfter, isBefore, parse } from "date-fns"

dotenv.config()
const profilePict: string | undefined = process.env.PROFILE_PICTURE as string

export const userRegisterService = async ({ id, email, firstName, lastName, phoneNumber, verifyCode }: IRegisterBody) => {
    if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 400 }
    if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap masukan format nomor telepon dengan benar', status: 400 }

    const findEmailInWorker = await prisma.worker.findFirst({ where: { email } })
    if (findEmailInWorker) throw { msg: 'User sudah terdaftar', status: 400 }


    const findUser = await prisma.user.findFirst({ where: { email } })
    if (findUser) throw { msg: 'User sudah terdaftar', status: 400 }

    const dataUser = await prisma.user.create({
        data: {
            id,
            email,
            firstName,
            password: await hashPassword('12312312'),
            lastName,
            phoneNumber,
            profilePicture: profilePict,
            isVerified: Boolean(false),
            verifyCode: verifyCode,
            isGoogleRegister: Boolean(false),
            isDiscountUsed: Boolean(true),
            role: 'CUSTOMER',
            isGooglePasswordChange: Boolean(false)
        }
    })

    const setTokenUser = await encodeToken({ id: dataUser?.id, role: dataUser?.email, expiresIn: '1h' })

    const emailHTML = fs.readFileSync('./src/public/sendMail/emailChangePassword.html', 'utf-8')
    let compiledHtml: any = compile(emailHTML)
    compiledHtml = compiledHtml({
        email: email,
        url: `http://localhost:3000/user/set-password/${setTokenUser}`,
    })

    await transporter.sendMail({
        to: email,
        html: compiledHtml,
        subject: 'Verifikasi akun dan atur ulang password anda'
    })

    await prisma.user.update({
        where: { id: dataUser?.id },
        data: { forgotPasswordToken: setTokenUser }
    })
}

export const userLoginService = async ({ email, password }: ILoginBody) => {

    if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 400 }
    const findUser = await prisma.user.findFirst({ where: { email } })

    if (!findUser) throw { msg: 'Email yang anda masukan salah atau tidak ada', status: 401 }

    const match = await comparePassword(password, findUser?.password)
    if (!match) throw { msg: 'Password anda salah!', status: 401 }

    const token = await encodeToken({ id: findUser?.id, role: findUser?.role })

    return { token, findUser }
}

export const signInWithGoogleService = async ({ email }: { email: string }) => {
    const findEmailInWorker = await prisma.worker.findFirst({ where: { email } })
    if (findEmailInWorker) throw { msg: 'Email sudah terpakai', status: 401 }

    const findEmail = await prisma.user.findFirst({ where: { email } })
    const token = await encodeToken({ id: findEmail?.id as string, role: findEmail?.role as string })

    return { findEmail, token }
}

export const userLogoutService = async ({ authorization, email }: { authorization: any, email: string }) => {
    const findUser = await prisma.user.findFirst({ where: { email } })
    if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }
    let token = authorization?.split(' ')[1] as string

    return { token }
}

export const resendEmailUserService = async ({ email }: { email: string }) => {
    const findUser = await prisma.user.findFirst({ where: { email } })
    if (!findUser) throw { msg: 'Email yang anda masukan tidak valid atau user tidak tersedia', status: 404 }
    const token = await encodeToken({ id: findUser?.id, role: findUser?.role, expiresIn: '10m' })

    const updateToken = await prisma.user.update({
        where: { id: findUser?.id },
        data: { forgotPasswordToken: token }
    })

    if (updateToken) {
        const readEmailHtml = fs.readFileSync('./src/public/sendMail/emailChangePassword.html', 'utf-8')
        let compiledHtml: any = compile(readEmailHtml)
        compiledHtml = compiledHtml({ email, url: `http://localhost:3000/user/set-password/${token}` })

        await transporter.sendMail({
            to: email,
            subject: 'Atur ulang kata sandi',
            html: compiledHtml
        })
    }
}

export const resendEmailWorkerService = async ({ email }: { email: string }) => {
    const findUser = await prisma.worker.findFirst({ where: { email } })
    if (!findUser) throw { msg: 'Email yang anda masukan tidak valid atau user tidak tersedia', status: 404 }
    const token = await encodeToken({ id: findUser?.id, role: findUser?.workerRole, expiresIn: '10m' })

    const updatedToken = await prisma.worker.update({
        where: { id: findUser?.id },
        data: { changePasswordToken: token }
    })

    if (updatedToken) {
        const readEmailHtml = fs.readFileSync('./src/public/sendMail/emailChangePassword.html', 'utf-8')
        let compiledHtml: any = compile(readEmailHtml)
        compiledHtml = compiledHtml({ email, url: `http://localhost:3000/worker/set-password/${token}` })

        await transporter.sendMail({
            to: email,
            subject: 'Atur ulang kata sandi',
            html: compiledHtml
        })
    }
}

export const setPasswordUserService = async ({ authorization, userId, password }: { authorization: any, userId: string, password: string }) => {
    const token = authorization?.split(' ')[1]
    const findUser = await prisma.user.findFirst({ where: { id: userId } })

    if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }
    if (token != findUser?.forgotPasswordToken) throw { msg: 'Link sudah tidak berlaku', status: 400 }

    const hashedPassword = await hashPassword(password)

    const updatedPassword = await prisma.user.update({
        data: {
            password: hashedPassword,
            isVerified: true,
            forgotPasswordToken: null
        },
        where: { id: userId }
    })

    if (updatedPassword) {
        const emailRead = fs.readFileSync('./src/public/sendMail/verifyEmailSucces.html', 'utf-8')
        let compiledHtml: any = compile(emailRead)
        compiledHtml = compiledHtml({ firstName: updatedPassword?.firstName, url: 'http://localhost:3000/user/login' })
        await transporter.sendMail({
            to: updatedPassword?.email,
            subject: `Selamat datang ${updatedPassword?.firstName}`,
            html: compiledHtml
        })
    }
}

export const setPasswordWorkerService = async ({ authorization, userId, password }: { authorization: any, userId: string, password: string }) => {
    const token = authorization?.split(' ')[1]
    const findUser = await prisma.worker.findFirst({ where: { id: userId } })

    if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }
    if (token != findUser?.changePasswordToken) throw { msg: 'Link sudah tidak berlaku', status: 400 }

    const hashedPassword = await hashPassword(password)

    const updatedPassword = await prisma.worker.update({
        data: {
            password: hashedPassword,
            changePasswordToken: null
        },
        where: { id: userId }
    })

    if (updatedPassword) {
        const emailRead = fs.readFileSync('./src/public/sendMail/verifyEmailSucces.html', 'utf-8')
        let compiledHtml: any = compile(emailRead)
        compiledHtml = compiledHtml({ firstName: updatedPassword?.firstName, url: 'http://localhost:3000/worker/login' })

        await transporter.sendMail({
            to: updatedPassword?.email,
            subject: `Selamat datang ${updatedPassword?.firstName}`,
            html: compiledHtml
        })
    }
}

export const workerLoginService = async ({ email, password }: ILoginBody) => {
    if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 400 }

    const findAdmin = await prisma.worker.findFirst({ where: { email }, include: { Shift: true } })
    if (!findAdmin) throw { msg: 'User admin tidak tersedia', status: 404 }

    if (findAdmin?.Shift?.startTime !== undefined) {
        const currentDate = format(new Date(), 'yyyy-MM-dd')
        const startTimeWorker = format(new Date(findAdmin?.Shift?.startTime!).toLocaleString('en-US', { timeZone: 'UTC' }), 'HH:mm:ss')
        const endTimeWorker = format(new Date(findAdmin?.Shift?.endTime!).toLocaleString('en-US', { timeZone: 'UTC' }), 'HH:mm:ss')

        const checkedShift = isAfter(format(new Date(), 'yyyy-MM-dd kk:mm:ss'), `${currentDate} ${startTimeWorker}`) && isBefore(format(new Date(), 'yyyy-MM-dd kk:mm:ss'), `${currentDate} ${endTimeWorker}`)
        if (checkedShift === false) throw { msg: 'Anda tidak dapat masuk diluar jam kerja', status: 401 }
    }

    const match = await comparePassword(password, findAdmin?.password)
    if (!match) throw { msg: 'Password anda salah!', status: 401 }

    const token = await encodeToken({ id: findAdmin?.id, role: findAdmin?.workerRole, storeId: findAdmin?.storeId as string })

    return { token, findAdmin }
}

export const createWorkerService = async ({
    id,
    email,
    firstName,
    lastName,
    phoneNumber,
    workerRole,
    identityNumber,
    storeId,
    motorcycleType,
    plateNumber,
    shiftId
}: ICreateWorkerService) => {
    if (!phoneNumberValidation(identityNumber)) throw { msg: 'Harap memasukan format angka pada nomor identitas anda', status: 400 }
    if (!validateEmail(email)) throw { msg: 'Harap masukan format email yang benar', status: 400 }
    if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap memasukan format angka pada nomor telepon anda', status: 400 }

    const findWorker = await prisma.worker.findFirst({
        where: {
            OR: [
                { email },
                { identityNumber }
            ]
        }
    })
    const findEmailInUser = await prisma.user.findFirst({ where: { email } })

    if (findWorker) throw { msg: 'Email atau nomor identitas sudah terpakai!', status: 401 }
    if (findEmailInUser) throw { msg: 'Email sudah terpakai!', status: 401 }

    await prisma.$transaction(async (tx) => {
        let dataWorker: any
        let token: string
        if (workerRole != 'DRIVER') {
            dataWorker = await tx.worker.create({
                data: {
                    id,
                    email,
                    password: await hashPassword('worker123'),
                    firstName,
                    lastName,
                    phoneNumber,
                    workerRole,
                    identityNumber,
                    storeId,
                    profilePicture: profilePict,
                    shiftId: Number(shiftId)
                }
            })

        } else {
            if (!motorcycleType || !plateNumber) throw { msg: 'Harap diisi terlebih dahulu', status: 400 }
            if (motorcycleType?.length < 2) throw { msg: 'Masukan tipe motor anda dengan benar, setidaknya lebih dari 2 huruf', status: 400 }
            if (plateNumber?.length < 4) throw { msg: 'Masukan plat motor anda dengan benar, setidaknya lebih dari 4 huruf', status: 400 }

            dataWorker = await tx.worker.create({
                data: {
                    id,
                    email,
                    password: await hashPassword('worker123'),
                    firstName,
                    lastName,
                    phoneNumber,
                    workerRole,
                    identityNumber,
                    storeId,
                    profilePicture: profilePict,
                    motorcycleType,
                    plateNumber,
                    shiftId: Number(shiftId)
                }
            })
        }

        token = await encodeToken({ id: dataWorker?.id, role: dataWorker?.workerRole, storeId })

        await tx.worker.update({
            where: { id: dataWorker?.id },
            data: {
                changePasswordToken: token
            }
        })

        const emailHtml = fs.readFileSync('./src/public/sendMail/emailChangePassword.html', 'utf-8')
        let compiledHtml: any = compile(emailHtml)
        compiledHtml = compiledHtml({
            email: email,
            url: `http://localhost:3000/worker/set-password/${token}`
        })

        transporter.sendMail({
            to: email,
            html: compiledHtml,
            subject: 'Reset password anda terlebih dahulu'
        })
    })

}
