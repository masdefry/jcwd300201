import { Request, Response, NextFunction } from "express";
import { handleMidtransNotificationService } from "@/services/midtransService";


export const handleMidtransNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = req.body;
        const transactionStatus = notification.transaction_status;
        const orderId = notification.order_id;

        await handleMidtransNotificationService({ orderId, transactionStatus })

        res.status(200).json({
            error: false,
            message: 'Transaksi Berhasil di update',
        });

    } catch (error) {
        next(error);
    }
};