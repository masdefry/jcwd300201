import prisma from "@/connection"
import { validateEmail } from "@/middleware/validation/emailValidation"
import { phoneNumberValidation } from "@/middleware/validation/phoneNumberValidation"
import { comparePassword, hashPassword } from "@/utils/passwordHash"
import { encodeToken } from "@/utils/tokenValidation"
import { transporter } from "@/utils/transporter"
import fs from 'fs'
import dotenv from 'dotenv'
import { compile } from "handlebars"
import { Status } from "@prisma/client"
import { IHandleMidtransNotification } from "./type"

dotenv.config()
const profilePict: string | undefined = process.env.PROFILE_PICTURE as string

/* * User Service  */

/* *register */
export const handleMidtransNotificationService = async ({ orderId, transactionStatus }: IHandleMidtransNotification) => {
    const transactionRecord = await prisma.order.findUnique({
        where: { id: orderId },
    });

    if (!transactionRecord) throw { msg: "Transaction not found" };


    let updatedStatus: Status;

    if (transactionStatus === "settlement" || transactionStatus === "capture") {
        updatedStatus = "PAYMENT_DONE";
        await prisma.orderStatus.create({
            data: {
                orderId: orderId,
                status: updatedStatus,
                createdAt: new Date(),
            },
        });

        
      const order = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                isPaid: true
            }
      })
    
        if(!order) throw {msg:'order tidak ditemukan', status:404}

    } else {
        throw new Error(`Invalid transaction status: ${transactionStatus}`);
    }


}