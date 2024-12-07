import prisma from "@/connection"
import { validateEmail } from "@/middleware/validation/emailValidation"
import { comparePassword } from "@/utils/passwordHash"
import { ILoginBody } from "./types"
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation"
import { hashPassword } from "@/utils/passwordHash"
import { encodeToken } from "@/utils/tokenValidation"
import { ICreateWorkerService } from "./types"

/* *login admin */
export const adminLoginService = async ({ email, password }: ILoginBody) => {
    
    if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 400 }
    
    const findAdmin = await prisma.worker.findFirst({
        where: { email }
    })

    if (!findAdmin) throw { msg: 'User admin tidak tersedia', status: 404 }

    const match = await comparePassword(password, findAdmin?.password)
    if (!match) throw { msg: 'Password anda salah!', status: 401 }

    const token = await encodeToken({ id: findAdmin?.id, role: findAdmin?.workerRole })

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
    if(!phoneNumberValidation(identityNumber)) throw { msg: 'Harap memasukan format angka pada nomor identitas anda', status: 400 }
    if (!validateEmail(email)) throw { msg: 'Harap masukan format email yang benar', status: 400 }
    if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap memasukan format angka pada nomor telepon anda', status: 400 }

    const findWorker = await prisma.worker.findFirst({
        where: { email }
    })

    const findEmailInUser = await prisma.users.findFirst({
        where: { email }
    })

    if (findWorker) throw { msg: 'Email sudah terpakai!', status: 401 }
    if (findEmailInUser) throw { msg: 'Email sudah terpakai!', status: 401 }

    await prisma.$transaction(async (tx) => {
        const dataWorker = await tx.worker.create({
            data: {
                email,
                password: await hashPassword('worker123'),
                firstName,
                lastName,
                phoneNumber,
                workerRole,
                identityNumber,
                storesId,
                profilePicture: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'
            }
        })
        const token = await encodeToken({ id: dataWorker?.id, role: dataWorker?.workerRole })

        if (motorcycleType && plateNumber) {
            await tx.worker.update({
                where: { id: dataWorker?.id },
                data: { motorcycleType, plateNumber }
            })
        }

        await tx.worker.update({
            where: { id: dataWorker?.id },
            data: {
                changePasswordToken: token
            }
        })
    })
}