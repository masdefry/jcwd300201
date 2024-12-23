import { Prisma } from "@prisma/client";
import { Status } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import prisma from "@/connection";
import { handleMidtransNotificationService } from "@/service/midtransService";


export const handleMidtransNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = req.body;
        const transactionStatus = notification.transaction_status;
        const orderId = notification.order_id;

        handleMidtransNotificationService({ orderId, transactionStatus })


        res.status(200).json({
            error: false,
            message: 'Transaksi Berhasil Di-Update',
        });

    } catch (error) {
        next(error);
    }
};