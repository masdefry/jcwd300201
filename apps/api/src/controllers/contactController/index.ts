import { createContactMessageService, getContactMessageService } from "@/services/contactService";
import { NextFunction, Request, Response } from "express";

export const createContactMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, name, email, phoneNumber, textHelp } = req.body
        await createContactMessageService({ userId, name, email, phoneNumber, textHelp })

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
        const { findMessageUser } = await getContactMessageService()

        res.status(200).json({
            error: false,
            message: 'Berhasil mendapatkan data',
            data: findMessageUser
        })

    } catch (error) {
        next(error)
    }
}