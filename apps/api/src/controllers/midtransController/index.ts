import { NextFunction, Request, Response } from "express";

export const createTransactionMidtrans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, totalPrice, totalWeight } = req.body

        //         id           String   @id @default(uuid())
        //   totalPrice   Int?
        //   totalWeight  Int?
        //   discount     Float?
        //   deliveryFee  Int
        //   paymentProof String?
        //   isPaid       Boolean
        //   isProcessed  Boolean?

        //   isSolved Boolean?
        //   notes    String?

        //   storeId      String?
        //   usersId       String?
        //   orderTypeId   Int?
        //   userAddressId Int?

    } catch (error) {
        next(error)
    }
}