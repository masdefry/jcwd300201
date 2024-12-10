import prisma from "@/connection"
import { validateEmail } from "@/middleware/validation/emailValidation"
import { comparePassword } from "@/utils/passwordHash"
import { ILoginBody } from "./types"
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation"
import { hashPassword } from "@/utils/passwordHash"
import { encodeToken } from "@/utils/tokenValidation"
import { ICreateWorkerService } from "./types"
import dotenv from 'dotenv'
import fs from 'fs'
import { compile } from "handlebars"
import { transporter } from "@/utils/transporter"

dotenv.config()
const profilePict: string | undefined = process.env.PROFILE_PICTURE as string

/* *login admin */
export const adminLoginService = async ({ email, password }: ILoginBody) => {

    if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 400 }

    const findAdmin = await prisma.worker.findFirst({
        where: { email }
    })

    if (!findAdmin) throw { msg: 'User admin tidak tersedia', status: 404 }

    const match = await comparePassword(password, findAdmin?.password)
    if (!match) throw { msg: 'Password anda salah!', status: 401 }

    const token = await encodeToken({ id: findAdmin?.id, role: findAdmin?.workerRole, storesId: findAdmin?.storesId as string })

    return { token, findAdmin }
}

/* *admin create worker */
export const createWorkerService = async ({
    email,
    firstName,
    lastName,
    phoneNumber,
    workerRole,
    identityNumber,
    storesId,
    motorcycleType,
    plateNumber
}: ICreateWorkerService) => {
    if (!phoneNumberValidation(identityNumber)) throw { msg: 'Harap memasukan format angka pada nomor identitas anda', status: 400 }
    if (!validateEmail(email)) throw { msg: 'Harap masukan format email yang benar', status: 400 }
    if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap memasukan format angka pada nomor telepon anda', status: 400 }

    const findWorker = await prisma.worker.findFirst({ where: { email } })
    const findEmailInUser = await prisma.users.findFirst({ where: { email } })

    if (findWorker) throw { msg: 'Email sudah terpakai!', status: 401 }
    if (findEmailInUser) throw { msg: 'Email sudah terpakai!', status: 401 }

    await prisma.$transaction(async (tx) => {
        let dataWorker: any
        let token: string

        if (workerRole != 'DRIVER') {
            dataWorker = await tx.worker.create({
                data: {
                    email,
                    password: await hashPassword('worker123'),
                    firstName,
                    lastName,
                    phoneNumber,
                    workerRole,
                    identityNumber,
                    storesId,
                    profilePicture: profilePict
                }
            })

        } else {
            if (!motorcycleType || !plateNumber) throw { msg: 'Harap diisi terlebih dahulu', status: 400 }
            if (motorcycleType?.length < 2) throw { msg: 'Masukan tipe motor anda dengan benar, setidaknya lebih dari 2 huruf', status: 400 }
            if (plateNumber?.length < 4) throw { msg: 'Masukan plat motor anda dengan benar, setidaknya lebih dari 4 huruf', status: 400 }

            dataWorker = await tx.worker.create({
                data: {
                    email,
                    password: await hashPassword('worker123'),
                    firstName,
                    lastName,
                    phoneNumber,
                    workerRole,
                    identityNumber,
                    storesId,
                    profilePicture: profilePict,
                    motorcycleType,
                    plateNumber
                }
            })
        }

        token = await encodeToken({ id: dataWorker?.id, role: dataWorker?.workerRole, storesId })

        await tx.worker.update({
            where: { id: dataWorker?.id },
            data: {
                changePasswordToken: token
            }
        })

        const emailHtml = fs.readFileSync('./src/public/sendMail/emailChangePasswordWorker.html', 'utf-8')
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