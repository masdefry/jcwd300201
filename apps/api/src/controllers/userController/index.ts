import { Request, Response, NextFunction } from "express"
import prisma from "@/connection"
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken'
import { signInWithGoogleService, userRegisterService } from "@/service/userRegisterService"
import { userLoginService } from "@/service/userLoginService"
import { encodeToken } from "@/utils/tokenValidation";
import { hashPassword } from "@/utils/passwordHash";

const secret_key: string | undefined = process.env.JWT_SECRET as string
export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req?.body
    const verifyCode = nanoid(6)

    await userRegisterService({ email, password, firstName, lastName, phoneNumber, verifyCode })

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

export const signInWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, profilePicture } = req.body;
    const verifyCode = nanoid(6);

    const { findEmail, token } = await signInWithGoogleService({ email })

    if (findEmail) {
      res.status(200).json({
        error: false,
        message: 'Login menggunakan Google berhasil!',
        data: { token }
      })
    } else {
      const newUser = await prisma.users.create({
        data: {
          firstName,
          lastName,
          email,
          password: await hashPassword('@googlesign123'),
          role: 'CUSTOMER',
          isVerified: Boolean(true),
          phoneNumber: 'Belum terisi',
          profilePicture: profilePicture,
          isDiscountUsed: true,
          isGoogleRegister: true,
          verifyCode
        }
      })
      
      const token = await encodeToken({ id: newUser?.id as string, role: newUser?.role as string })

      res.status(201).json({
        error: false,
        message: 'Masuk menggunakan Google berhasil!',
        data: {
          token,
          email,
          firstName: newUser?.firstName,
          lastName: newUser?.lastName,
          role: newUser?.role,
          phoneNumber: newUser?.phoneNumber,
          profilePicture: newUser?.profilePicture,
        }
      })
    }

  } catch (error) {
    next(error)
  }
}