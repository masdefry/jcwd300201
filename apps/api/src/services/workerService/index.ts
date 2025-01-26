import prisma from "@/connection"
import { validateEmail } from "@/middlewares/validation/emailValidation"
import { phoneNumberValidation } from "@/middlewares/validation/phoneNumberValidation"
import { IChangePasswordWorker, ICreateNotes, IGetAllWorker, IUpdateProfileWorker } from "./types"
import fs, { rmSync } from 'fs'
import { comparePassword, hashPassword } from "@/utils/passwordHash"
import dotenv from 'dotenv'
import { cloudinaryUpload } from "@/utils/cloudinary"

dotenv.config()
const profilePict: string | undefined = process.env.PROFILE_PICTURE as string

interface Image {
    filename: string;
}

export const updateProfileWorkerService = async ({ userId, email, phoneNumber, firstName, lastName, imageUploaded }: IUpdateProfileWorker) => {
    const findUser = await prisma.worker.findFirst({ where: { id: userId } })
    const findEmail = await prisma.worker.findFirst({ where: { email } })

    if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }
    if (findEmail && findEmail?.email !== findUser?.email) throw { msg: 'Email sudah terpakai', status: 401 }
    if (!validateEmail(email)) throw { msg: 'Harap masukan email dengan format yang valid', status: 401 }
    if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap masukan nomor telepon dengan format nomor', status: 401 }
    if (email === findUser?.email && firstName === findUser?.firstName && lastName === findUser?.lastName && phoneNumber === findUser?.phoneNumber && (imageUploaded?.images?.length === 0 || imageUploaded?.images?.length === undefined)) throw { msg: 'Data tidak ada yang diubah', status: 400 }

    // const dataImage: string[] = imageUploaded?.images?.map((img: Image) => {
    //     return img?.filename
    // })

    let dataImage: any
    if (imageUploaded?.images?.length !== undefined) {
        dataImage = await Promise.all(imageUploaded?.images?.map(async (item: any) => {
            const result: any = await cloudinaryUpload(item?.buffer)
            return result?.res!
        }))
    }

    const newDataWorker = await prisma.worker.update({
        where: { id: userId },
        data: { firstName, lastName, email, phoneNumber, profilePicture: dataImage?.length > 0 ? dataImage[0] : findUser?.profilePicture }
    })

    if (!findUser?.profilePicture.includes('https://') && newDataWorker?.profilePicture !== findUser?.profilePicture) { /** ini bersikap sementara karna default value profilePict itu dari google / berupa https:// */
        fs.rmSync(`src/public/images/${findUser?.profilePicture}`) /**sedangkan ini menghapus directory membaca folder public/images akan menyebabkan error */
    }

}

export const changePasswordWorkerService = async ({ userId, password, existingPassword }: IChangePasswordWorker) => {
    const findWorker = await prisma.worker.findFirst({ where: { id: userId } })
    const compareOldPassword = await comparePassword(existingPassword, findWorker?.password as string)
    if (!compareOldPassword) throw { msg: 'Password lama anda salah', status: 401 }
    if (existingPassword === password) throw { msg: 'Harap masukan password yang berbeda', status: 401 }

    const hashedPassword = await hashPassword(password)
    await prisma.worker.update({
        where: { id: userId },
        data: { password: hashedPassword }
    })
}

export const deleteProfilePictureWorkerService = async ({ userId }: { userId: string }) => {
    const findWorker = await prisma.worker.findFirst({ where: { id: userId } })
    if (!findWorker) throw { msg: 'Data tidak tersedia', status: 404 }

    await prisma.worker.update({
        where: { id: userId },
        data: { profilePicture: profilePict }
    })

    // if (!findWorker?.profilePicture?.includes(profilePict)) {
    //     rmSync(`src/public/images/${findWorker?.profilePicture}`)
    // }
}

export const createNotesService = async ({ email, notes, orderId }: ICreateNotes) => {
    const findWorker = await prisma.worker.findFirst({ where: { email } })
    if (!findWorker) throw { msg: "Worker tidak tersedia", status: 404 }
    const order = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderDetail: true,
        },
    });

    if (!order) throw { msg: 'Order tidak ditemukan', status: 404 }

    const note = await prisma.order.update({
        where: {
            id: order.id
        },
        data: {
            isSolved: true,
            notes: notes
        }
    })

    return { note }
}

export const getAllWorkerService = async ({ whereClause, take, skip }: IGetAllWorker) => {
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

    return { findWorker, totalPages }
}

export const deleteDataWorkerByIdService = async ({ id }: { id: string }) => {
    const findWorker = await prisma.worker.findFirst({ where: { id } })
    if (!findWorker) throw { msg: 'User tidak tersedia atau sudah terhapus', status: 404 }
    if (findWorker?.workerRole === 'SUPER_ADMIN') throw { msg: 'Gagal menghapus, silahkan pilih pekerja yang lain', status: 401 }

    await prisma.worker.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    })
}