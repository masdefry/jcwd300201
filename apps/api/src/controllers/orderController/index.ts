import prisma from "@/connection"
import { NextFunction, Request, Response } from "express";

export const requestPickUp = async (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (error) {
    next(error)
  }
}

export const getOrderType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderTypes = await prisma.orderType.findMany({
      where: {
        deletedAt: null
      }
    });
    res.status(200).json({
      error: false,
      message: "Data berhasil didapat!",
      data: orderTypes
    });
  } catch (error) {
    next(error);
  }
};