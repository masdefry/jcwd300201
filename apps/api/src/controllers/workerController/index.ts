import prisma from "@/connection"
import { NextFunction, Request, Response } from "express";


export const getOrdersForDriver = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {userId, workerRole} = req.body; 

    const worker = await prisma.worker.findUnique({
      where: {
        id: userId,
        workerRole: workerRole
      },
      select: { storesId: true },
    });

    if (!worker) {
      return res.status(404).json({ message: "Driver tidak ditemukan" });
    }

    const storeId = worker.storesId;

    const orders = await prisma.order.findFirst({
      where: {
        storesId: storeId,
        orderStatus: {
          some: { status: 'AWAITING_DRIVER_PICKUP' }, 
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        orderStatus: true, 
      },
    });

    res.status(201).json({
      error: false,
      message: "Order menunggu pickup berhasil didapatkan!",
      order: orders,
      
    });  } catch (error) {
    next(error);
  }
};



