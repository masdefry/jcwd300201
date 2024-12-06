import { Request, Response, NextFunction } from "express"
import { validateEmail } from "@/middleware/validation/emailValidation"
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation"
import prisma from "@/connection"
import { hashPassword } from "@/utils/passwordHash"
import { nanoid } from 'nanoid';
import fs from 'fs'
import { encodeToken } from "@/utils/tokenValidation";
import { compile } from "handlebars";
import { comparePassword } from "@/utils/passwordHash"
import { transporter } from "@/utils/transporter"
import jwt from 'jsonwebtoken'
import { userRegisterService } from "@/service/userRegisterService"
import { userLoginService } from "@/service/userLoginService"

const secret_key: string | undefined = process.env.JWT_SECRET as string
export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req?.body
    const verifyCode = nanoid(6)

    await userRegisterService({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      verifyCode
    })

    res?.status(200).json({
      error: false,
      message: 'Berhasil membuat akun, silahkan login!',
      data: {}
    })

  } catch (error) {
    next(error)
  }
}

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req?.body

    const dataLogin = await userLoginService({ email, password })

    res?.status(200).json({
      error: false,
      message: 'Berhasil login, silahkan masuk!',
      data: {
        token: dataLogin?.token,
        email,
        role: dataLogin?.findUser?.role,
        firstName: dataLogin?.findUser?.firstName,
        lastName: dataLogin?.findUser?.lastName,
        isVerify: dataLogin?.findUser?.isVerified,
        profilePicture: dataLogin?.findUser?.profilePicture,
        phoneNumber: dataLogin?.findUser?.phoneNumber
      }
    })
  } catch (error) {
    next(error)
  }
}

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body

    const findUser = await prisma.users.findFirst({
      where: { email }
    })

    console.log(findUser, '<<<<<<<<<<')

    if (!findUser) throw { msg: 'User tidak tersedia', status: 404 }

    const { authorization } = req.headers
    let token = authorization?.split(' ')[1] as string

    jwt.verify(token, secret_key, (err) => {
      if (err) throw { msg: 'Invalid token', status: 401 }

      req.app.locals.credentials = null
    })

    res.status(200).json({
      error: false,
      message: 'Berhasil logout!',
      data: {}
    })
  } catch (error) {
    next(error)
  }
}


export const userCreateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { addressName,
      addressDetail,
      province,
      city,
      zipCode,
      latitude,
      longitude,
      userId,
      country = "Indonesia" } = req.body

    const hasMainAddress = await prisma.userAddress.findFirst({
      where: {
        usersId: userId,
        isMain: true,
      },
    });

    const isMain = !hasMainAddress;

    const newAddress = await prisma.userAddress.create({
      data: {
        addressName,
        addressDetail,
        province,
        city,
        zipCode,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        isMain,
        country,
        usersId: userId,
      },
    });

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
    const {
      addressName,
      addressDetail,
      province,
      city,
      zipCode,
      latitude,
      longitude,
      country,
    } = req.body;

    const existingAddress = await prisma.userAddress.findUnique({
      where: { id: parseInt(addressId) },
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { id: parseInt(addressId) },
      data: {
        addressName,
        addressDetail,
        province,
        city,
        zipCode,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        country,
      },
    });

    res.status(200).json({
      error: false,
      message: "Alamat anda berhasil di-update!",
      data: updatedAddress,
    });

  } catch (error) {
    next(error)
  }
}
