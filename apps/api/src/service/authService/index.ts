import prisma from "@/connection"
import { validateEmail } from "@/middleware/validation/emailValidation"
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation"
import { comparePassword, hashPassword } from "@/utils/passwordHash"
import { encodeToken } from "@/utils/tokenValidation"
import { transporter } from "@/utils/transporter"
import fs from 'fs'
import dotenv from 'dotenv'
import { compile } from "handlebars"
import { ICreateWorkerService, ILoginBody, IRegisterBody } from "./types"

dotenv.config()
const profilePict: string | undefined = process.env.PROFILE_PICTURE as string

/* * User Service  */

/* *register */
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

/* *login */
export const userLoginService = async ({ email, password }: ILoginBody) => {

    if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 400 }
    const findUser = await prisma.user.findFirst({ where: { email } })

    if (!findUser) throw { msg: 'Email yang anda masukan salah atau tidak ada', status: 401 }

    const match = await comparePassword(password, findUser?.password)
    if (!match) throw { msg: 'Password anda salah!', status: 401 }

    const token = await encodeToken({ id: findUser?.id, role: findUser?.role })

    return { token, findUser }
}

/**sign with google */
export const signInWithGoogleService = async ({ email }: { email: string }) => {
    const findEmailInWorker = await prisma.worker.findFirst({ where: { email } })
    if (findEmailInWorker) throw { msg: 'Email sudah terpakai', status: 401 }

    const findEmail = await prisma.user.findFirst({ where: { email } })
    const token = await encodeToken({ id: findEmail?.id as string, role: findEmail?.role as string })

    return { findEmail, token }
}

// user logout
export const userLogoutService = async ({ authorization, email }: { authorization: any, email: string }) => {
    const findUser = await prisma.user.findFirst({ where: { email } })
    if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }
    let token = authorization?.split(' ')[1] as string

    return { token }
}


/** worker service */

/* *login admin */
export const workerLoginService = async ({ email, password }: ILoginBody) => {

    if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 400 }

    const findAdmin = await prisma.worker.findFirst({ where: { email } })
    if (!findAdmin) throw { msg: 'User admin tidak tersedia', status: 404 }

    const match = await comparePassword(password, findAdmin?.password)
    if (!match) throw { msg: 'Password anda salah!', status: 401 }

    const token = await encodeToken({ id: findAdmin?.id, role: findAdmin?.workerRole, storeId: findAdmin?.storeId as string })

    return { token, findAdmin }
}

/* *admin create worker */
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
    plateNumber
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
                    profilePicture: profilePict
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
                    plateNumber
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
            url: `http://localhost:3000/worker/reset-password/${token}`
        })

        transporter.sendMail({
            to: email,
            html: compiledHtml,
            subject: 'Reset password anda terlebih dahulu'
        })
    })

}
