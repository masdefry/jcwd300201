import prisma from "@/connection"
import { validateEmail } from "@/middleware/validation/emailValidation"
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation"
import { IChangePasswordWorker, ICreateNotes, IGetAllWorker, IGetLaundryItems, IUpdateProfileWorker } from "./types"
import fs, { rmSync } from 'fs'
import { comparePassword, hashPassword } from "@/utils/passwordHash"
import dotenv from 'dotenv'

dotenv.config()
const profilePict: string | undefined = process.env.PROFILE_PICTURE as string

/* update profil worker */
export const updateProfileWorkerService = async ({ userId, email, phoneNumber, firstName, lastName, imageUploaded }: IUpdateProfileWorker) => {
    const findUser = await prisma.worker.findFirst({ where: { id: userId } })
    const findEmail = await prisma.worker.findFirst({ where: { email } })

    if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }
    if (findEmail && findEmail?.email !== findUser?.email) throw { msg: 'Email sudah terpakai', status: 401 }
    if (!validateEmail(email)) throw { msg: 'Harap masukan email dengan format yang valid', status: 401 }
    if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap masukan nomor telepon dengan format nomor', status: 401 }
    if (email === findUser?.email && firstName === findUser?.firstName && lastName === findUser?.lastName && phoneNumber === findUser?.phoneNumber && (imageUploaded?.images?.length === 0 || imageUploaded?.images?.length === undefined)) throw { msg: 'Data tidak ada yang diubah', status: 400 }

    const dataImage: string[] = imageUploaded?.images?.map((img: any) => {
        return img?.filename
    })

    const newDataWorker = await prisma.worker.update({
        where: { id: userId },
        data: { firstName, lastName, email, phoneNumber, profilePicture: dataImage?.length > 0 ? dataImage[0] : findUser?.profilePicture }
    })

    if (!findUser?.profilePicture.includes('https://') && newDataWorker?.profilePicture !== findUser?.profilePicture) { /** ini bersikap sementara karna default value profilePict itu dari google / berupa https:// */
        fs.rmSync(`src/public/images/${findUser?.profilePicture}`) /**sedangkan ini menghapus directory membaca folder public/images akan menyebabkan error */
    }

}

/* change password worker */
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

/* delete profile picture */
export const deleteProfilePictureWorkerService = async ({ userId }: { userId: string }) => {
    const findWorker = await prisma.worker.findFirst({ where: { id: userId } })
    if (!findWorker) throw { msg: 'Data tidak tersedia', status: 404 }

    await prisma.worker.update({
        where: { id: userId },
        data: { profilePicture: profilePict }
    })

    if (!findWorker?.profilePicture?.includes(profilePict)) {
        rmSync(`src/public/images/${findWorker?.profilePicture}`)
    }
}

/* create notes worker */
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

    const note: any = await prisma.order.update({
        where: {
            id: order.id
        },
        data: {
            isSolved: true,
            notes: notes
        }
    })

    return note
}

/* super admin ---[] */

/* get all worker */
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

/* delete worker by id */
export const deleteDataWorkerByIdService = async ({ id }: { id: string }) => {
    const findWorker = await prisma.worker.findFirst({ where: { id } })
    if (!findWorker) throw { msg: 'User tidak tersedia atau sudah terhapus', status: 404 }
    if (findWorker?.workerRole === 'SUPER_ADMIN') throw { msg: 'Gagal menghapus, silahkan pilih pekerja yang lain', status: 401 }

    await prisma.worker.delete({ where: { id } })
}

/* get laundry items */
export const getLaundryItemsService = async ({ limit, page, search, sort }: IGetLaundryItems) => {
    const take = parseInt(limit as string)
    const skip = (parseInt(page as string) - 1) * take
    let whereClause;

    if (search) {
        whereClause = {
            OR: [
                { itemName: { contains: search as string } },
            ]
        }
    }
    let findItem: any


    const totalData = await prisma.laundryItem.count({
        where: whereClause
    })

    if (sort == 'name-asc') {
        findItem = await prisma.laundryItem.findMany({
            where: whereClause, take, skip, orderBy: { itemName: 'asc' }

        })
    } else if (sort == 'name-desc') {
        findItem = await prisma.laundryItem.findMany({
            where: whereClause, take, skip, orderBy: { itemName: 'desc' }
        })
    } else if (sort == 'latest-item') {
        findItem = await prisma.laundryItem.findMany({
            where: whereClause, take, skip, orderBy: { createdAt: 'desc' }
        })
    } else if (sort == 'oldest-item') {
        findItem = await prisma.laundryItem.findMany({
            where: whereClause, take, skip, orderBy: { createdAt: 'asc' }
        })
    } else {
        findItem = await prisma.laundryItem.findMany({
            where: whereClause, take, skip
        })
    }

    if (findItem?.length === 0) throw { msg: 'Data item tidak tersedia', status: 404 }
    const totalPage = Math.ceil(totalData / Number(limit))

    return { findItem, totalPage }
}

export const createLaundryItemsService = async ({ itemName }: { itemName: string }) => {
    const findName = await prisma.laundryItem.findFirst({ where: { itemName } })
    if (findName) throw { msg: 'Data sudah tersedia', status: 406 }
    await prisma.laundryItem.create({ data: { itemName } })
}

export const deleteLaundryItemsService = async ({ id }: { id: string }) => {
    const findItem = await prisma.laundryItem.findFirst({ where: { id: Number(id) } })
    if (!findItem) throw { msg: 'Data sudah tidak tersedia atau sudah terhapus', status: 404 }
    await prisma.laundryItem.delete({ where: { id: Number(id) } })
}

export const updateLaundryItemsService = async ({ id, itemName }: { id: string, itemName: string }) => {
    const findData = await prisma.laundryItem.findFirst({ where: { id: Number(id) } })
    if (!findData) throw { msg: "Data tidak tersedia", status: 404 }

    const findItem = await prisma.laundryItem.findFirst({ where: { itemName } })
    if (findItem) throw { msg: 'Data sudah tersedia', status: 406 }

    await prisma.laundryItem.update({ data: { itemName }, where: { id: Number(id) } })
}

/* []--- super admin */