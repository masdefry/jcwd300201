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

const secret_key: string | undefined = process.env.JWT_SECRET as string
export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req?.body
    const verifyCode = nanoid(6)

    if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 400 }
    if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap masukan format nomor telepon dengan benar', status: 400 }
    const findUser = await prisma.users.findFirst({ where: { email } })
    if (findUser) throw { msg: 'User sudah terdaftar', status: 400 }

    const hashedPassword = await hashPassword(password)

    const dataUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        profilePicture: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
        isVerified: Boolean(false),
        verifyCode: verifyCode,
        isGoogleRegister: Boolean(false),
        isDiscountUsed: Boolean(true),
        role: 'CUSTOMER'
      }
    })

    const setTokenUser = await encodeToken({ id: dataUser?.id, role: dataUser?.email });

    const emailHTML = fs.readFileSync('./src/public/sendMail/emailVerification.html', 'utf-8');
    let compiledHtml: any = await compile(emailHTML);
    compiledHtml = compiledHtml({
      firstName: firstName,
      email: email,
      url: `http://localhost:3000/user/verification-user/${verifyCode}-CNC-${setTokenUser}`,
      verifCode: verifyCode
    });

    await transporter.sendMail({
      to: email,
      html: compiledHtml,
      subject: 'Verification your email!'
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

    if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 400 }
    const findUser = await prisma.users.findFirst({ where: { email } })

    if (!findUser) throw { msg: 'Email yang anda masukan salah atau tidak ada', status: 401 }

    const match = await comparePassword(password, findUser?.password)
    if (!match) throw { msg: 'Password anda salah!', status: 401 }

    const token = await encodeToken({ id: findUser?.id, role: findUser?.role })

    res?.status(200).json({
      error: false,
      message: 'Berhasil login, silahkan masuk!',
      data: {
        token,
        email,
        role: findUser?.role,
        firstName: findUser?.firstName,
        lastName: findUser?.lastName,
        isVerify: findUser?.isVerified,
        profilePicture: findUser?.profilePicture,
        phoneNumber: findUser?.isDiscountUsed
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