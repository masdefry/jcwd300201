import prisma from "@/connection"
import { comparePassword } from "@/utils/passwordHash"
import { validateEmail } from "@/middleware/validation/emailValidation"
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation"
import { hashPassword } from "@/utils/passwordHash"
import { encodeToken } from "@/utils/tokenValidation"
import { transporter } from "@/utils/transporter"
import fs from 'fs'
import { compile } from "handlebars"
import { ILoginBody } from "./types"
import { IRegisterBody } from "./types"

/* *login */
export const userLoginService = async ({ email, password }: ILoginBody) => {

    if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 400 }
    const findUser = await prisma.users.findFirst({ where: { email } })

    if (!findUser) throw { msg: 'Email yang anda masukan salah atau tidak ada', status: 401 }

    const match = await comparePassword(password, findUser?.password)
    if (!match) throw { msg: 'Password anda salah!', status: 401 }

    const token = await encodeToken({ id: findUser?.id, role: findUser?.role })

    return { token, findUser }
}

/* *register */
export const userRegisterService = async ({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    verifyCode,
}: IRegisterBody) => {
    if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 400 }
    if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap masukan format nomor telepon dengan benar', status: 400 }

    const findEmailInWorker = await prisma.worker.findFirst({ where: { email } })
    if (findEmailInWorker) throw { msg: 'User sudah terdaftar', status: 400 }

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
}

/**sign with google */
export const signInWithGoogleService = async ({ email }: { email: string }) => {
    const findEmailInWorker = await prisma.worker.findFirst({
        where: { email }
    })

    if (findEmailInWorker) throw { msg: 'Email sudah terpakai', status: 401 }

    const findEmail = await prisma.users.findFirst({
        where: { email }
    })

    const token = await encodeToken({ id: findEmail?.id as string, role: findEmail?.role as string })

    return { findEmail, token }
}