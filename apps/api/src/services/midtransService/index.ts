import prisma from "@/connection"
import dotenv from 'dotenv'
import { Status } from "@prisma/client"
import { IHandleMidtransNotification } from "./type"
import { addHours } from "date-fns"

dotenv.config()
export const handleMidtransNotificationService = async ({ orderId, transactionStatus }: IHandleMidtransNotification) => {

    const transactionRecord = await prisma.order.findUnique({
        where: { id: orderId },
    });

    if (!transactionRecord) throw { msg: "Transaksi tidak tersedia", status: 404 };
    let updatedStatus: Status;

    if (transactionStatus === "settlement" || transactionStatus === "capture") {
        updatedStatus = "PAYMENT_DONE";
        const create = await prisma.orderStatus.create({
            data: {
                orderId: orderId,
                status: updatedStatus,
                createdAt: new Date()
            },
        });
        if (!create) throw { msg: 'Order status gagal di-update, silahkan coba lagi' }

        const order = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                isPaid: true
            }
        })

        if (!order) throw { msg: 'Order tidak ditemukan', status: 404 }
    } else {
        throw { msg: 'Transaksi Gagal!', status: 400 }
    }
}