import { Request, Response, NextFunction } from "express"
import prisma from "@/connection"
import { changeMainAddressUserServices, changePasswordGoogleRegisterService, changePasswordUserService, deleteProfilePictureUserService, deleteUserAddressService, getAllUserAddressesService, getSingleAddressUserService, getUserMainAddressService, updateProfileUserService, userCreateAddressService, userEditAddressService } from "@/services/userService"
import dotenv from 'dotenv'
dotenv.config()


export const userCreateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { addressName, addressDetail, province, city, zipCode, latitude, longitude, userId, country = "Indonesia" } = req.body
    const { newAddress } = await userCreateAddressService({ addressName, addressDetail, province, city, zipCode, latitude, longitude, userId, country })

    res.status(201).json({
      error: false,
      message: "Alamat berhasil ditambahkan",
      data: newAddress,
    });

  } catch (error) {
    next(error)
  }
}

export const userEditAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { addressId } = req.params;
    const { addressName, addressDetail, province, city, zipCode, latitude, longitude, country, userId } = req.body;
    const { updatedAddress } = await userEditAddressService({ addressId, addressName, addressDetail, province, city, zipCode, latitude, longitude, country, userId })

    res.status(200).json({
      error: false,
      message: "Alamat anda berhasil di update!",
      data: updatedAddress,
    });

  } catch (error) {
    next(error)
  }
}

export const getSingleAddressUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    const { findAddressById } = await getSingleAddressUserService({ id, userId })

    res.status(200).json({
      error: false,
      message: 'Berhasil mendapat data',
      data: findAddressById
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUserAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body
    const { search } = req.query

    const searchType = typeof search === 'string' ? search : ''
    const { addresses } = await getAllUserAddressesService({ userId, search: searchType as string })

    res.status(201).json({
      error: false,
      message: "Alamat berhasil ditambahkan",
      data: addresses,
    });

  } catch (error) {
    next(error)
  }
};

export const getUserMainAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    const { mainAddress } = await getUserMainAddressService({ userId })

    res.status(201).json({
      error: false,
      message: "Alamat berhasil ditambahkan",
      data: mainAddress,
    });
  } catch (error) {
    next(error)
  }
}

export const userPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, userId, imageUrl, orderId } = req.body

    if (imageUrl.length == 0) throw { msg: 'Gambar wajib diisi', status: 400 }

    const userData = await prisma.user.findFirst({
      where: { email }
    })
    if (!userData) throw { msg: "User tidak ada", status: 404 }

    const paymentImage = await prisma.order.update({
      where: {
        id: String(orderId)
      },
      data: {
        paymentProof: imageUrl,
        isPaid: true
      }
    })
    if (!paymentImage) throw { msg: "Bukti pembayaran tidak valid", status: 404 }

    const orderStatus = await prisma.orderStatus.create({
      data: {
        status: 'PAYMENT_DONE',
        orderId: String(orderId),
        workerId: userId,
      }
    })
    if (!orderStatus) throw { msg: "Order status tidak berhasil dibuat, silahkan coba lagi", status: 404 }

  } catch (error) {
    next(error)
  }

}

export const confirmOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, userId, orderId } = req.body

    const userData = await prisma.user.findFirst({
      where: {
        email,
        id: userId
      }
    })
    if (!userData) throw { msg: "User tidak ada", status: 404 }


    const orderStatus = await prisma.orderStatus.create({
      data: {
        status: 'PAYMENT_DONE',
        orderId: String(orderId),
        workerId: userId,
      }
    })
    if (!orderStatus) throw { msg: "Order status tidak berhasil dibuat, silahkan coba lagi", status: 404 }

  } catch (error) {
    next(error)
  }

}

export const getSingleDataUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body

    const findUser = await prisma.user.findFirst({ where: { id: userId } })

    res.status(200).json({
      error: false,
      message: 'Berhasil mendapatkan data',
      data: findUser
    })

  } catch (error) {
    next(error)
  }
}

interface UploadedFile {
  filename: string;
}

interface UploadedFiles {
  images?: UploadedFile[];
}

interface IUpdateProfileUser {
  userId: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  imageUploaded?: UploadedFiles;
}

export const updateProfileUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageUploaded = req.files as any
    const { userId, email, phoneNumber, firstName, lastName } = req.body

    await updateProfileUserService({ userId, email, phoneNumber, firstName, lastName, imageUploaded })

    res.status(200).json({
      error: false,
      message: 'Berhasil mengubah data',
      data: {}
    })
  } catch (error) {
    next(error)
  }
}

export const changePasswordUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, password, existingPassword } = req?.body

    await changePasswordUserService({ userId, password, existingPassword })

    res.status(200).json({
      error: false,
      message: 'Password berhasil diubah',
      data: {}
    })

  } catch (error) {
    next(error)
  }
}

export const deleteProfilePictureUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body

    await deleteProfilePictureUserService({ userId })

    res.status(200).json({
      error: false,
      message: 'Berhasil menghapus foto profil',
      data: {}
    })

  } catch (error) {
    next(error)
  }
}

export const changePasswordGoogleRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, password } = req.body
    await changePasswordGoogleRegisterService({ userId, password })

    res.status(200).json({
      error: false,
      message: 'Berhasil merubah password baru',
      data: {}
    })

  } catch (error) {
    next(error)
  }
}

export const deleteUserAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { addressId } = req.params
    const { userId } = req.body

    await deleteUserAddressService({ userId, addressId: Number(addressId) })

    res.status(200).json({
      error: false,
      message: 'Alamat berhasil dihapus',
      data: {}
    })
  } catch (error) {
    next(error)
  }
}

export const changeMainAddressUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    await changeMainAddressUserServices({ id: Number(id), userId })

    res.status(200).json({
      error: false,
      message: 'Berhasil merubah alamat utama',
      data: {}
    })

  } catch (error) {
    next(error)
  }
}