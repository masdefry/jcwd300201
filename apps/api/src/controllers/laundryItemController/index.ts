import prisma from "@/connection";
import { NextFunction, Request, Response } from "express";


export const getListItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    const worker = await prisma.worker.findFirst({
      where: {
        id: userId,
      },
      select: { storeId: true },
    });

    if (!worker) throw { msg: "Driver tidak tersedia", status: 404 }


    const dataItem = await prisma.laundryItem.findMany({
      where: {
        deletedAt: null
      }
    })
    res.status(200).json({
      error: false,
      message: "Order berhasil didapatkan!",
      data:
        dataItem
    });
  } catch (error) {
    next(error)
  }
}