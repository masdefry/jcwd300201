import prisma from "@/connection";
import { validateEmail } from "@/middleware/validation/emailValidation";
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation";
import { transporter } from "@/utils/transporter";
import { NextFunction, Request, Response } from "express";
import fs from 'fs'
import { compile } from "handlebars";

export const createContactMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, name, email, phoneNumber, textHelp } = req.body

        if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 401 }
        if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap masukan format dengan angka', status: 401 }
        const messageUser = await prisma.contact.create({ data: { name, email, phoneNumber, userId: userId, textHelp } })

        if (messageUser) {
            const emailFile = fs.readFileSync('./src/public/sendMail/emailContact.html', 'utf-8')
            let compiledHtml: any = compile(emailFile)
            compiledHtml = compiledHtml({ firstName: name, url: 'http://localhost:3000' })
            await transporter.sendMail({
                to: email,
                subject: 'Terimakasih telah menghubungi kami',
                html: compiledHtml
            })
        }

        res.status(200).json({
            error: false,
            message: 'Terima kasih atas laporan kamu. Kami akan segera meninjau pesan yang kamu kirimkan.',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}