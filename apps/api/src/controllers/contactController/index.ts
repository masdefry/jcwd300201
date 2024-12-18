import prisma from "@/connection";
import { validateEmail } from "@/middleware/validation/emailValidation";
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation";
import { NextFunction, Request, Response } from "express";

export const createContactMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, name, email, phoneNumber, textHelp } = req.body

        if (!validateEmail(email)) throw { msg: 'Harap masukan format email dengan benar', status: 401 }
        if (!phoneNumberValidation(phoneNumber)) throw { msg: 'Harap masukan format dengan angka', status: 401 }
        await prisma.contact.create({ data: { name, email, phoneNumber, userId: userId, textHelp } })

        // transporter

        res.status(200).json({
            error: false,
            message: 'Terima kasih atas laporan kamu. Kami akan segera meninjau pesan yang kamu kirimkan.',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}