import prisma from "@/connection"
import { comparePassword } from "@/utils/passwordHash"
import { validateEmail } from "@/middlewares/validation/emailValidation"
import { phoneNumberValidation } from "@/middlewares/validation/phoneNumberValidation"
import { hashPassword } from "@/utils/passwordHash"
import fs, { rmSync } from 'fs'
import { ICreateAddressUser, IEditAddressUser, IUpdateProfileUser } from "./types"
import dotenv from 'dotenv'
import axios from "axios"
import { Prisma } from "@prisma/client"
import { cloudinaryUpload } from "@/utils/cloudinary"

dotenv.config()
const profilePict: string | undefined = process.env.PROFILE_PICTURE as string
const rajaOngkirApiKey: string | undefined = process.env.RAJAONGKIR_API_KEY as string

export const userCreateAddressService = async ({ userId, addressName, addressDetail, province, city, zipCode, latitude, longitude, country }: ICreateAddressUser) => {
    const hasMainAddress = await prisma.userAddress.findFirst({
        where: {
            userId,
            isMain: true,
        },
    })

    const findAddressUser = await prisma.userAddress.findMany({ where: { userId } })
    if (findAddressUser?.length >= 5) throw { msg: 'Alamat anda sudah penuh, harap hapus salah satu alamat anda', status: 401 }

    const isMain = !hasMainAddress;
    const responseApi = await axios.get(`https://api.rajaongkir.com/starter/province?id=${province}`, {
        headers: {
            key: rajaOngkirApiKey
        }
    });

    const provinceName: string = responseApi?.data?.rajaongkir?.results?.province
    const checkedAddressUser = await prisma.userAddress.findFirst({
        where: {
            AND: [
                { addressName },
                { addressDetail },
                { province: provinceName },
                { city },
                { zipCode },
                { userId }
            ]
        }
    })

    if (checkedAddressUser) throw { msg: 'Alamat sudah tersedia, harap masukan alamat berbeda', status: 400 }
    const newAddress = await prisma.userAddress.create({
        data: {
            addressName,
            addressDetail,
            province: provinceName,
            city,
            zipCode,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            isMain,
            country,
            userId: userId,
        },
    });

    return { newAddress }
}

export const userEditAddressService = async ({ addressId, addressName, addressDetail, province, city, zipCode, latitude, longitude, country, userId }: IEditAddressUser) => {
    const existingAddress = await prisma.userAddress.findFirst({ where: { id: parseInt(addressId) } })
    if (!existingAddress) throw { msg: 'Alamat tidak tersedia', status: 404 }

    const responseApi = await axios.get(`https://api.rajaongkir.com/starter/province?id=${province}`, {
        headers: { key: rajaOngkirApiKey }
    });

    const provinceName: string = responseApi?.data?.rajaongkir?.results?.province
    const checkedAddressUser = await prisma.userAddress.findFirst({
        where: {
            AND: [
                { addressName },
                { addressDetail },
                { province: provinceName },
                { city },
                { zipCode },
                { userId }
            ]
        }
    })

    if (checkedAddressUser) throw { msg: 'Alamat sudah tersedia, harap masukan alamat yang lain', status: 400 }
    const findOrderUser = await prisma.order.findFirst({
        where: {
            userId,
            UserAddress: { id: Number(addressId), userId },
        }
    })

    if (findOrderUser) throw { msg: 'Kamu sedang melakukan pesanan, tidak dapat merubah alamat', status: 400 }
    const updatedAddress = await prisma.userAddress.update({
        where: { id: parseInt(addressId) },
        data: {
            addressName,
            addressDetail,
            province: provinceName,
            city,
            zipCode,
            latitude: latitude ? parseFloat(latitude) : existingAddress?.latitude,
            longitude: longitude ? parseFloat(longitude) : existingAddress?.longitude,
            country,
        },
    });


    return { updatedAddress }
}

export const getSingleAddressUserService = async ({ id, userId }: { id: string, userId: string }) => {
    const findAddressById = await prisma.userAddress.findFirst({ where: { id: Number(id), userId } })
    if (!findAddressById) throw { msg: 'Data alamat sudah tidak tersedia', status: 404 }

    return { findAddressById }
}

export const getAllUserAddressesService = async ({ userId, search }: { userId: string, search: string }) => {
    let addresses

    if (search) {
        addresses = await prisma.userAddress.findMany({
            where: {
                userId,
                OR: [
                    { addressName: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
                    { addressDetail: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
                    { city: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
                    { province: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
                    { country: { contains: search as string, mode: 'insensitive' as Prisma.QueryMode } },
                ]
            },
            include: {
                User: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })
    } else {
        addresses = await prisma.userAddress.findMany({
            where: { userId },
            orderBy: { isMain: 'desc' },
            include: {
                User: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
    }


    if (addresses.length === 0) throw { msg: 'User belum menambahkan alamat', status: 404 }

    return { addresses }
}

export const getUserMainAddressService = async ({ userId }: { userId: string }) => {
    const mainAddress = await prisma.userAddress.findFirst({
        where: {
            userId: userId,
            isMain: true,
        },
        include: {
            User: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    });

    if (!mainAddress) throw { msg: "Alamat utama tidak ditemukan" }

    return { mainAddress }
}

interface Image {
    filename: any;
}

interface ImageUpload {
    images: Image[];
}

export const updateProfileUserService = async ({ userId, email, phoneNumber, firstName, lastName, imageUploaded }: IUpdateProfileUser) => {
    const findUser = await prisma.user.findFirst({ where: { id: userId } })
    const findEmail = await prisma.user.findFirst({ where: { email } })

    if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }
    if (findEmail && findEmail?.email !== findUser?.email) throw { msg: 'Email sudah terpakai', status: 401 }
    if (!validateEmail(email)) throw { msg: 'Harap masukan email dengan format yang valid', status: 401 }
    if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap masukan nomor telepon dengan format nomor', status: 401 }
    if (email === findUser?.email && firstName === findUser?.firstName && lastName === findUser?.lastName && phoneNumber === findUser?.phoneNumber && (imageUploaded?.images?.length === 0 || imageUploaded?.images?.length === undefined)) throw { msg: 'Data tidak ada yang diubah', status: 400 }

    // const dataImage: string[] = imageUploaded?.images?.map((img: any) => {
    //     return img?.filename
    // })

    let dataImage: any
    if (imageUploaded?.images?.length !== undefined) {
        dataImage = await Promise.all(imageUploaded?.images?.map(async (item: any) => {
            const result: any = await cloudinaryUpload(item?.buffer)
            return result?.res!
        }))
    }

    const newDataUser = await prisma.user.update({
        where: { id: userId },
        data: { firstName, lastName, email, phoneNumber, profilePicture: dataImage?.length > 0 ? dataImage[0] : findUser?.profilePicture }
    })

    if (!findUser?.profilePicture.includes('https://') && newDataUser?.profilePicture !== findUser?.profilePicture) {
        fs.rmSync(`src/public/images/${findUser?.profilePicture}`)
    }
}

export const changePasswordUserService = async ({ userId, password, existingPassword }: { userId: string, password: string, existingPassword: string }) => {
    const findUser = await prisma.user.findFirst({ where: { id: userId } })
    const compareOldPassword = await comparePassword(existingPassword, findUser?.password as string)
    if (!compareOldPassword) throw { msg: 'Password lama anda salah', status: 401 }
    if (existingPassword === password) throw { msg: 'Harap masukan password yang berbeda', status: 401 }

    const hashedPassword = await hashPassword(password)
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    })
}

export const deleteProfilePictureUserService = async ({ userId }: { userId: string }) => {
    const findUser = await prisma.user.findFirst({ where: { id: userId } })
    if (!findUser) throw { msg: 'Data tidak tersedia', status: 404 }

    await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: profilePict }
    })

    // if (!findUser?.profilePicture?.includes(profilePict)) {
    //     rmSync(`src/public/images/${findUser?.profilePicture}`)
    // }
}

export const changePasswordGoogleRegisterService = async ({ userId, password }: { userId: string, password: string }) => {
    const findUser = await prisma.user.findFirst({ where: { id: userId } })
    if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }

    const hashed = await hashPassword(password)
    await prisma.user.update({ where: { id: userId }, data: { password: hashed, isGooglePasswordChange: false } })

}

export const deleteUserAddressService = async ({ userId, addressId }: { userId: string, addressId: number }) => {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const findAddressById = await tx.userAddress.findFirst({ where: { id: Number(addressId), userId } })
        const findAllAddress = await tx.userAddress.findMany({ where: { userId } })
        const findOrderUser = await tx.order.findFirst({
            where: {
                userId,
                UserAddress: { id: addressId, userId },
            }
        })

        if (findOrderUser) throw { msg: 'Kamu sedang melakukan pesanan, tidak dapat menghapus alamat', status: 400 }
        if (!findAddressById) throw { msg: 'Alamat sudah tidak tersedia atau sudah terhapus', status: 404 }
        if (findAllAddress?.length === 1 && findAddressById?.isMain == true) throw { msg: 'Alamat utama tidak dapat dihapus karena setidaknya satu alamat diperlukan sebagai alamat utama', status: 400 }
        await tx.userAddress.delete({ where: { id: Number(addressId), userId } })

        const findAddressAfterDelete = await tx.userAddress.findMany({ where: { userId } })
        if (findAddressAfterDelete?.length > 0) {
            await tx.userAddress.update({
                where: { id: Number(findAddressAfterDelete[0]?.id), userId },
                data: { isMain: true }
            })
        }
    }, { timeout: 30000 })
}

export const changeMainAddressUserServices = async ({ id, userId }: { id: number, userId: string }) => {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const findAddress = await tx.userAddress.findUnique({ where: { id: Number(id), userId } })
        const findAddressMain = await tx.userAddress.findFirst({ where: { isMain: true, userId } })

        if (!findAddress) throw { msg: 'Data alamat tidak tersedia', status: 404 }
        if (findAddress?.isMain === true) throw { msg: 'Ini adalah alamat utama anda', status: 406 }

        const updatedMainAddress = await tx.userAddress.update({
            where: { id: Number(findAddressMain?.id), userId },
            data: { isMain: false }
        })

        if (updatedMainAddress) {
            await tx.userAddress.update({
                where: { id: Number(id), userId },
                data: { isMain: true }
            })
        }
    }, { timeout: 30000 })
}