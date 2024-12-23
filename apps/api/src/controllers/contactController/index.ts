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

export const getContactMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const { sort = '', search = '', page = '1', limit_data = '5' } = req.query

        // const take = parseInt(limit_data as string)
        // const skip = (parseInt(page as string) - 1) * take

        // let whereClause
        // if (search) {
        //     whereClause = {
        //         OR: [
        //             { User: { firstName: { contains: search as string } } },
        //             { phoneNumber: { contains: search as string } },
        //             { textHelp: { contains: search as string } },
        //         ]
        //     }
        // }

        // let dataMessage;
        // if (sort == 'order-asc') {
        //     dataMessage = await prisma.contact.findMany({
        //         where: whereClause, take, skip, orderBy: { createdAt: 'asc' },
        //     })
        // } else if (sort == 'order-desc') {
        //     dataMessage = await prisma.contact.findMany({
        //         where: whereClause, take, skip, orderBy: { createdAt: 'desc' },
        //     })
        // } else {
        //     dataMessage = await prisma.contact.findMany({
        //         where: whereClause, take, skip,
        //     })
        // }

        // const totalData = await prisma.contact.count({
        //     where: whereClause
        // })

        // const totalPages = Math.ceil(Number(totalData) / take)
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

        res.status(200).json({
            error: false,
            message: 'Berhasil mendapatkan data',
            data: findMessageUser
            // { totalPages, dataMessage }
        })

    } catch (error) {
        next(error)
    }
}