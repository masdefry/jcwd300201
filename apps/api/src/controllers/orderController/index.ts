import prisma from "@/connection"
import { NextFunction, Request, Response } from "express";
const axios = require('axios');


export const requestPickUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body

  } catch (error) {

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

export const getProvince = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.get('https://api.rajaongkir.com/starter/province', {
      headers: {
        key: 'b4b88bdd2e2065e365b688c79ebc550c'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Terjadi Error');
  }
}
export const getCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { province_id } = req.query as { province_id?: string };

    const response = await axios.get(`https://api.rajaongkir.com/starter/city${province_id ? `?province=${province_id}` : ''}`, {
      headers: {
        key: 'b4b88bdd2e2065e365b688c79ebc550c'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Terjadi Error');
  }
}