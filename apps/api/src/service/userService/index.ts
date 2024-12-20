import prisma from "@/connection"
import { comparePassword } from "@/utils/passwordHash"
import { validateEmail } from "@/middleware/validation/emailValidation"
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation"
import { hashPassword } from "@/utils/passwordHash"
import { encodeToken } from "@/utils/tokenValidation"
import { transporter } from "@/utils/transporter"
import fs, { rmSync } from 'fs'
import { compile } from "handlebars"
import { ICreateAddressUser, IEditAddressUser, ILoginBody, IUpdateProfileUser } from "./types"
import { IRegisterBody } from "./types"
import dotenv from 'dotenv'
import axios from "axios"

dotenv.config()
const profilePict: string | undefined = process.env.PROFILE_PICTURE as string
const rajaOngkirApiKey: string | undefined = process.env.RAJAONGKIR_API_KEY as string

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

/**sign with google */
export const signInWithGoogleService = async ({ email }: { email: string }) => {
    const findEmailInWorker = await prisma.worker.findFirst({
        where: { email }
    })

    if (findEmailInWorker) throw { msg: 'Email sudah terpakai', status: 401 }

    const findEmail = await prisma.user.findFirst({
        where: { email }
    })

    const token = await encodeToken({ id: findEmail?.id as string, role: findEmail?.role as string })

    return { findEmail, token }
}

/* get address */
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
    const responseApi: any = await axios.get(`https://api.rajaongkir.com/starter/province?id=${province}`, {
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

    console.log(checkedAddressUser, "< dapet ga")
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

/* edit address */
export const userEditAddressService = async ({ addressId, addressName, addressDetail, province, city, zipCode, latitude, longitude, country, userId }: IEditAddressUser) => {
    const existingAddress = await prisma.userAddress.findFirst({ where: { id: parseInt(addressId) } })
    if (!existingAddress) throw { msg: 'Alamat tidak tersedia', status: 404 }

    const responseApi: any = await axios.get(`https://api.rajaongkir.com/starter/province?id=${province}`, {
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

/* get single address */
export const getSingleAddressUserService = async ({ id, userId }: { id: string, userId: string }) => {
    const findAddressById = await prisma.userAddress.findFirst({ where: { id: Number(id), userId } })
    if (!findAddressById) throw { msg: 'Data alamat sudah tidak tersedia', status: 404 }

    return { findAddressById }
}

/* get all user address */
export const getAllUserAddressesService = async ({ userId, search }: { userId: string, search: string }) => {
    let addresses

    if (search) {
        addresses = await prisma.userAddress.findMany({
            where: {
                userId,
                OR: [
                    { addressName: { contains: search as string } },
                    { addressDetail: { contains: search as string } },
                    { city: { contains: search as string } },
                    { province: { contains: search as string } },
                    { country: { contains: search as string } },
                ]
            }
        })
    } else {
        addresses = await prisma.userAddress.findMany({
            where: { userId },
            orderBy: { isMain: 'desc' },
        });
    }


    if (addresses.length === 0) throw { msg: 'User belum menambahkan alamat', status: 404 }

    return { addresses }
}

/* get main address */
export const getUserMainAddressService = async ({ userId }: { userId: string }) => {
    const mainAddress = await prisma.userAddress.findFirst({
        where: {
            userId: userId,
            isMain: true,
        },
    });

    if (!mainAddress) throw { msg: "Alamat utama tidak ditemukan" }

    return { mainAddress }
}

/* resend email */
export const resendSetPasswordService = async ({ email }: { email: string }) => {
    const findUser = await prisma.user.findFirst({ where: { email } })
    if (!findUser) throw { msg: 'User tidak terdaftar', status: 401 }
    const token = await encodeToken({ id: findUser?.id, role: findUser?.role, expiresIn: '1h' })

    const emailFile = fs.readFileSync('./src/public/sendMail/email.html', 'utf-8')
    let compiledHtml: any = compile(emailFile)
    compiledHtml = compiledHtml({ email, url: `http://localhost:3000/user/set-password/${token}` })

    await prisma.user.update({
        where: { id: findUser?.id },
        data: { forgotPasswordToken: token }
    })
}

/* setPassword User */
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

/* forgot password */
export const forgotPasswordUserService = async ({ email }: { email: string }) => {
    const findUser = await prisma.user.findFirst({ where: { email } })
    if (!findUser) throw { msg: 'Email yang anda masukan tidak valid atau user tidak tersedia', status: 404 }

    const token = await encodeToken({ id: findUser?.id, role: findUser?.role, expiresIn: '5m' })

    const updatedToken = await prisma.user.update({
        where: { id: findUser?.id },
        data: { forgotPasswordToken: token }
    })

    if (updatedToken) {
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

/* update profil */
export const updateProfileUserService = async ({ userId, email, phoneNumber, firstName, lastName, imageUploaded }: IUpdateProfileUser) => {
    const findUser = await prisma.user.findFirst({ where: { id: userId } })
    const findEmail = await prisma.user.findFirst({ where: { email } })

    if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }
    if (findEmail && findEmail?.email !== findUser?.email) throw { msg: 'Email sudah terpakai', status: 401 }
    if (!validateEmail(email)) throw { msg: 'Harap masukan email dengan format yang valid', status: 401 }
    if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap masukan nomor telepon dengan format nomor', status: 401 }
    if (email === findUser?.email && firstName === findUser?.firstName && lastName === findUser?.lastName && phoneNumber === findUser?.phoneNumber && (imageUploaded?.images?.length === 0 || imageUploaded?.images?.length === undefined)) throw { msg: 'Data tidak ada yang diubah', status: 400 }

    const dataImage: string[] = imageUploaded?.images?.map((img: any) => {
        return img?.filename
    })

    const newDataUser = await prisma.user.update({
        where: { id: userId },
        data: { firstName, lastName, email, phoneNumber, profilePicture: dataImage?.length > 0 ? dataImage[0] : findUser?.profilePicture }
    })

    if (!findUser?.profilePicture.includes('https://') && newDataUser?.profilePicture !== findUser?.profilePicture) { /** ini bersikap sementara karna default value profilePict itu dari google / berupa https:// */
        fs.rmSync(`src/public/images/${findUser?.profilePicture}`) /**sedangkan ini menghapus directory membaca folder public/images akan menyebabkan error */
    }
}

/* change password */
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

/* delete profile pict */
export const deleteProfilePictureUserService = async ({ userId }: { userId: string }) => {
    const findUser = await prisma.user.findFirst({ where: { id: userId } })
    if (!findUser) throw { msg: 'Data tidak tersedia', status: 404 }

    await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: profilePict }
    })

    if (!findUser?.profilePicture?.includes(profilePict)) {
        rmSync(`src/public/images/${findUser?.profilePicture}`)
    }
}

/* change password user login google */
export const changePasswordGoogleRegisterService = async ({ userId, password }: { userId: string, password: string }) => {
    const findUser = await prisma.user.findFirst({ where: { id: userId } })
    if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }

    const hashed = await hashPassword(password)
    await prisma.user.update({ where: { id: userId }, data: { password: hashed, isGooglePasswordChange: false } })

}

/* delete user address */
export const deleteUserAddressService = async ({ userId, addressId }: { userId: string, addressId: number }) => {
    const findAddressById = await prisma.userAddress.findFirst({ where: { id: Number(addressId), userId } })
    const findAllAddress = await prisma.userAddress.findMany({ where: { userId } })
    if (!findAddressById) throw { msg: 'Alamat sudah tidak tersedia atau sudah terhapus', status: 404 }
    if (findAllAddress?.length === 1 && findAddressById?.isMain == true) throw { msg: 'Alamat utama tidak dapat dihapus karena setidaknya satu alamat diperlukan sebagai alamat utama', status: 400 }
    await prisma.userAddress.delete({ where: { id: Number(addressId), userId } })

    const findAddressAfterDelete = await prisma.userAddress.findMany({ where: { userId } })
    if (findAddressAfterDelete?.length > 0) {
        await prisma.userAddress.update({
            where: { id: Number(findAddressAfterDelete[0]?.id), userId },
            data: { isMain: true }
        })
    }
}