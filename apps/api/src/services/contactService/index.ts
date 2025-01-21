import prisma from "@/connection"
import { validateEmail } from "@/middlewares/validation/emailValidation"
import { phoneNumberValidation } from "@/middlewares/validation/phoneNumberValidation"
import { compile } from "handlebars"
import fs from 'fs'
import { transporter } from "@/utils/transporter"
import { IContactMessage } from "./types"

export const createContactMessageService = async ({ email, phoneNumber, userId, textHelp, name }: IContactMessage) => {
    if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 401 }
    if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap masukan format dengan angka', status: 401 }
    const messageUser = await prisma.contact.create({ data: { name, email, phoneNumber, userId: userId, textHelp } })

    if (messageUser) {
        const emailFile = fs.readFileSync('./src/public/sendMail/emailContact.html', 'utf-8')
        let template = compile(emailFile)
        const compiledHtml = template({ firstName: name, url: 'http://localhost:3000' })
        await transporter.sendMail({
            to: email,
            subject: 'Terimakasih telah menghubungi kami',
            html: compiledHtml
        })
    }
}

export const getContactMessageService = async () => {
    const findMessageUser = await prisma.contact.findMany({
        where: { deletedAt: null },
        include: {
            User: {
                select: {
                    firstName: true,
                    lastName: true,
                    profilePicture: true,
                    phoneNumber: true,
                    email: true,
                },
            }
        }
    })

    return { findMessageUser }
}
